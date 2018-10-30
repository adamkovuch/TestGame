"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const security_1 = require("./security");
const routes_1 = require("../config/routes");
const inversify_1 = require("inversify");
require("reflect-metadata");
const security_2 = require("../config/security");
const db_connection_1 = require("./db.connection");
const logger_1 = require("./logger");
const error_exception_1 = require("./error.exception");
const providers_1 = require("../config/providers");
const got = require("got");
const repository_data_1 = require("./repository/repository.data");
const repository_lang_1 = require("./repository/repository.lang");
const repository_observer_1 = require("./repository/repository.observer");
const file_response_1 = require("./models/file.response");
class Router {
    constructor() {
        this.repositoryObserverType = Symbol.for("repositoryObserverType");
        this.logger = logger_1.getLogger(Router);
        this.logger.info(`Router Starting`);
        this.routes = routes_1.getRoutes();
        this.container = new inversify_1.Container();
        this.binding();
        this.autoCache();
    }
    cleanup() {
        this.db.disconnect();
    }
    autoCache() {
        const url = process.env.AUTOCACHE_URL;
        if (!url || url === '') {
            this.logger.warn("AUTOCACHE wasn't run. Global variable AUTOCACHE_URL isn't defined");
            return;
        }
        this.logger.info(`Self test for ${url} started`);
        const handler = () => {
            this.logger.info(`Running auto cache for ${url}`);
            got
                .get(url)
                .then(res => {
                if (res.statusCode == 200) {
                    this.logger.info("Caching OK");
                }
                else {
                    this.logger.error(`Caching ERROR. Response = ${res.statusCode}`);
                }
            })
                .catch(err => this.logger.error(`Caching ERROR. Response = ${JSON.stringify(err)}`));
        };
        setInterval(handler, 900000);
        handler();
    }
    getRepositoryInstance(repositoryType, entityType) {
        return function (context) {
            const container = context.container.createChild();
            container.bind('entityType').toConstantValue(entityType);
            container.bind(repositoryType).toSelf();
            const res = container.resolve(repositoryType);
            container.unbind('entityType');
            container.unbind(repositoryType);
            return res;
        };
    }
    binding() {
        this.logger.info(`Binding elements to DI container`);
        this.container.bind(inversify_1.Container).toConstantValue(this.container);
        this.logger.debug(`Binding DB instance`);
        this.container.bind(db_connection_1.DbConnection).to(db_connection_1.DbConnection);
        this.db = this.container.get(db_connection_1.DbConnection);
        this.db.getAllModelTypes().forEach(elem => {
            this.logger.debug(`Binding DB data repository for ${elem.name}`);
            this.container.bind(repository_data_1.RepositoryData.of(elem)).toDynamicValue(this.getRepositoryInstance(repository_data_1.RepositoryData, elem));
        });
        this.db.getAllModelTypes().forEach(elem => {
            this.logger.debug(`Binding DB lang repository for ${elem.name}`);
            this.container.bind(repository_lang_1.RepositoryLang.of(elem)).toDynamicValue(this.getRepositoryInstance(repository_lang_1.RepositoryLang, elem));
        });
        this.routes.forEach(element => {
            this.logger.debug(`Binding controller ${element.controller.name}`);
            this.container.bind(element.controller).to(element.controller);
            if (element.controller.prototype.onDataChanged) {
                this.container.bind(this.repositoryObserverType).to(element.controller);
            }
        });
        this.logger.debug(`Binding security`);
        this.bindSecurity();
        this.logger.debug(`Binding providers`);
        this.bindProviders();
        this.logger.info(`Binding completed`);
    }
    bindSecurity() {
        let principles = security_2.getPrinciples();
        principles.forEach(elem => {
            this.logger.debug(`SecurityPrinciple ${elem.name}`);
            this.container.bind(elem).to(elem);
        });
    }
    bindProviders() {
        const providers = providers_1.provider();
        for (let i in providers) {
            const elem = providers[i];
            this.logger.debug(`Provider ${elem.name}`);
            const dependency = elem;
            if (dependency.name && (dependency.useClass || dependency.useValue)) {
                if (dependency.useClass) {
                    this.container.bind(elem.name).to(dependency.useClass);
                }
                else {
                    this.container.bind(elem.name).toConstantValue(dependency.useValue);
                }
            }
            else {
                const type = dependency;
                this.container.bind(type).to(type);
            }
        }
    }
    secure() {
        this.logger.info(`Securing routes`);
        if (process.env.NOSECURITY) {
            this.logger.warn(`Security is disabled. Need to remove NOSECURITY from env variables.`);
            return;
        }
        const principleTypes = security_2.getPrinciples();
        const principles = new Array();
        principleTypes.forEach(elem => {
            this.logger.debug(`Creating security principle ${elem.name}`);
            principles.push(this.container.resolve(elem));
        });
        this.security = new security_1.Security(principles);
    }
    async route() {
        const expressRouter = express.Router();
        this.secure();
        await this.db.connect();
        this.logger.info(`Mapping controllers`);
        this.routes.forEach(element => {
            this.logger.debug(`Mapping controller [${element.path}] => [${element.controller.name}]`);
            expressRouter.get(element.path, this.handleRequest(element.controller));
            expressRouter.post(element.path, this.handleRequest(element.controller));
            expressRouter.put(element.path, this.handleRequest(element.controller));
            expressRouter.delete(element.path, this.handleRequest(element.controller));
            expressRouter.get(element.path + '/:id', this.handleRequest(element.controller));
            expressRouter.post(element.path + '/:id', this.handleRequest(element.controller));
            expressRouter.put(element.path + '/:id', this.handleRequest(element.controller));
            expressRouter.delete(element.path + '/:id', this.handleRequest(element.controller));
            this.logger.debug(`Controller [${element.controller.name}] is ready`);
        });
        expressRouter.use('*', this.handleRequest(null));
        this.logger.info(`Router initialized`);
        return expressRouter;
    }
    bindLang(container, lang) {
        if (lang) {
            if (container.isBound('lang')) {
                container.rebind('lang').toConstantValue(lang);
            }
            else {
                container.bind('lang').toConstantValue(lang);
            }
        }
        else {
            if (container.isBound('lang')) {
                container.rebind('lang').toConstantValue('none');
            }
            else {
                container.bind('lang').toConstantValue('none');
            }
        }
    }
    handleRequest(controllerType) {
        return async (req, res) => {
            const container = this.container.createChild();
            try {
                this.logger.info(`Got request [${req.method}] ${req.originalUrl}`);
                if (!controllerType) {
                    throw new error_exception_1.AppError(404, 'Not Found');
                }
                this.bindLang(container, req.query.lang);
                this.logger.debug(`Creating controller [${controllerType.name}]`);
                container.bind(repository_observer_1.ObserverListener).toSelf().inSingletonScope();
                const controller = container.resolve(controllerType);
                this.logger.debug(`Controller created`);
                let methodHandler = null;
                let controllerHandler = null;
                switch (req.method) {
                    case "GET":
                        methodHandler = controller.get;
                        controllerHandler = (controller, req, id) => controller.get(req, id);
                        break;
                    case "POST":
                        methodHandler = controller.post;
                        controllerHandler = (controller, req, id) => controller.post(req, id);
                        break;
                    case "PUT":
                        methodHandler = controller.put;
                        controllerHandler = (controller, req, id) => controller.put(req, id);
                        break;
                    case "DELETE":
                        methodHandler = controller.delete;
                        controllerHandler = (controller, req, id) => controller.delete(req, id);
                        break;
                }
                let response;
                const id = req.params.id;
                if (this.security && methodHandler) {
                    await this.security.checkSecurity(req, methodHandler);
                }
                if (id) {
                    response = await controllerHandler(controller, req, id);
                }
                else {
                    response = await controllerHandler(controller, req);
                }
                if (response) {
                    if (response instanceof file_response_1.FileResponse) {
                        res.status(200).sendFile(response.filename);
                    }
                    else {
                        res.status(200).json(response);
                    }
                    this.logger.debug(`Response: \n ${JSON.stringify(response)}`);
                }
                else {
                    res.sendStatus(204);
                }
                this.logger.info(`Response sent`);
            }
            catch (err) {
                if (err.responsecode && err.responsecode < 600) {
                    res.status(err.responsecode).json({ message: err.message });
                    this.logger.info(`Controller return error code '${err.responsecode}'`);
                }
                else {
                    res.status(500).json({ message: err.message, stack: err.stack });
                    this.logger.error(`Unhandled error '${err.message}' in path ${req.originalUrl} `, { error: err });
                }
            }
            finally {
                this.logger.debug('Postprocessing request');
                this.requestPostProcess(container, req);
                container.unbind(repository_observer_1.ObserverListener);
                container.unbindAll();
                container.unload();
            }
        };
    }
    requestPostProcess(container, req) {
        const observerListener = container.get(repository_observer_1.ObserverListener);
        this.handleRepositoryChanges(container, observerListener);
    }
    handleRepositoryChanges(container, observerListener) {
        const observers = container.getAll(this.repositoryObserverType);
        observerListener.observe(observers);
    }
}
exports.Router = Router;
//# sourceMappingURL=router.js.map