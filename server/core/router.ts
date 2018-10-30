import { Route } from './models/route';
import { Controller } from './controller';
import { Request, Response } from 'express';
import * as express from 'express';
import { Security, SecurityPrinciple } from './security';
import { getRoutes } from '../config/routes';
import { Container, interfaces } from 'inversify';
import 'reflect-metadata';
import { getPrinciples } from '../config/security';
import { DbConnection } from './db.connection';
import { getLogger } from './logger';
import { AppError } from './error.exception';
import { provider } from '../config/providers';
import * as got from 'got';
import { RepositoryData } from './repository/repository.data';
import { Localization } from './localization';
import { RepositoryLang } from './repository/repository.lang';
import { RepositoryObserver, ObserverListener } from './repository/repository.observer';
import { TokenController } from './controllers/token.controller';
import { FileResponse } from './models/file.response';
import { Type } from '../extensions/type';
import { Dependency } from './models/dependency';

export class Router {
    private routes: Route[];
    private container: Container;
    private security: Security;
    private db: DbConnection;

    private repositoryObserverType = Symbol.for("repositoryObserverType");
    private logger = getLogger(Router);

    constructor() {
        this.logger.info(`Router Starting`);
        this.routes = getRoutes();

        this.container = new Container();
        this.binding();

        this.autoCache();
    }

    public cleanup() {
        this.db.disconnect();
    }

    private autoCache() {
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
                .then(res=> {
                    if(res.statusCode == 200) {
                        this.logger.info("Caching OK");
                    } else {
                        this.logger.error(`Caching ERROR. Response = ${res.statusCode}`);
                    }
                })
                .catch(err=> this.logger.error(`Caching ERROR. Response = ${JSON.stringify(err)}`));
        };
        setInterval(handler,900000);
        handler();
    }

    private getRepositoryInstance(repositoryType: any, entityType: any) {
        return function (context: interfaces.Context) {
            const container = context.container.createChild();
            container.bind('entityType').toConstantValue(entityType);
            container.bind(repositoryType).toSelf();
            const res = container.resolve(repositoryType);
            container.unbind('entityType');
            container.unbind(repositoryType);
            return res;
        };
        
    }

    private binding() {
        this.logger.info(`Binding elements to DI container`);
        this.container.bind<Container>(Container).toConstantValue(this.container);

        this.logger.debug(`Binding DB instance`);
        this.container.bind<DbConnection>(DbConnection).to(DbConnection);
        this.db = this.container.get<DbConnection>(DbConnection);

        this.db.getAllModelTypes().forEach(elem=> {
            this.logger.debug(`Binding DB data repository for ${elem.name}`);

            this.container.bind(RepositoryData.of(elem)).toDynamicValue(this.getRepositoryInstance(RepositoryData, elem));
        });

        this.db.getAllModelTypes().forEach(elem=> {
            this.logger.debug(`Binding DB lang repository for ${elem.name}`);

            this.container.bind(RepositoryLang.of(elem)).toDynamicValue(this.getRepositoryInstance(RepositoryLang, elem));
        });

        this.routes.forEach(element => {
            this.logger.debug(`Binding controller ${element.controller.name}`);
            this.container.bind<Controller>(element.controller).to(element.controller);
            if(element.controller.prototype.onDataChanged) {
                this.container.bind(this.repositoryObserverType).to(element.controller);
            }
        });

        this.logger.debug(`Binding security`);
        this.bindSecurity();

        this.logger.debug(`Binding providers`);
        this.bindProviders();

        this.logger.info(`Binding completed`);

    }

    private bindSecurity() {
        let principles = getPrinciples();
        principles.forEach(elem => {
            this.logger.debug(`SecurityPrinciple ${elem.name}`);
            this.container.bind<SecurityPrinciple>(elem).to(elem);
        });
    }

    private bindProviders() {
        const providers = provider();
        for(let i in providers) {
            const elem = providers[i];
            
            this.logger.debug(`Provider ${elem.name}`);

            const dependency = <Dependency>elem;
            if(dependency.name && (dependency.useClass || dependency.useValue)) {
                if(dependency.useClass) {
                    this.container.bind(elem.name).to(dependency.useClass);
                } else {
                    this.container.bind(elem.name).toConstantValue(dependency.useValue);
                }
            } else {
                const type = <Type<any>>dependency;
                this.container.bind<typeof type>(type).to(type);
            }
        }
    }

    public secure() {
        this.logger.info(`Securing routes`);
        if(process.env.NOSECURITY) {
            this.logger.warn(`Security is disabled. Need to remove NOSECURITY from env variables.`);
            return;
        }

        const principleTypes = getPrinciples();
        const principles = new Array<SecurityPrinciple>();
        principleTypes.forEach(elem => {
            this.logger.debug(`Creating security principle ${elem.name}`);
            principles.push(this.container.resolve<SecurityPrinciple>(elem));
        });
        this.security = new Security(principles);
    }

    public async route() {
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

            expressRouter.get(element.path+'/:id', this.handleRequest(element.controller));
            expressRouter.post(element.path+'/:id', this.handleRequest(element.controller));
            expressRouter.put(element.path+'/:id', this.handleRequest(element.controller));
            expressRouter.delete(element.path+'/:id', this.handleRequest(element.controller));
            
            this.logger.debug(`Controller [${element.controller.name}] is ready`);
        });

        expressRouter.use('*', this.handleRequest(null));

        this.logger.info(`Router initialized`);

        return expressRouter;
    }

    private bindLang (container: Container, lang?: string) {
        if(lang) {
            if(container.isBound('lang')) {
                container.rebind('lang').toConstantValue(lang);
            } else {
                container.bind('lang').toConstantValue(lang);
            }
        } else {
            if(container.isBound('lang')) {
                container.rebind('lang').toConstantValue('none');
            } else {
                container.bind('lang').toConstantValue('none');
            }
        }
    }

    private handleRequest(controllerType) {
        return async (req: Request, res: Response) => {
            const container = this.container.createChild();

            try {
                this.logger.info(`Got request [${req.method}] ${req.originalUrl}`);
                if(!controllerType) {
                    throw new AppError(404, 'Not Found');
                }

                this.bindLang(container, req.query.lang);
                this.logger.debug(`Creating controller [${controllerType.name}]`);

                container.bind<ObserverListener>(ObserverListener).toSelf().inSingletonScope();
                const controller = container.resolve<Controller>(controllerType);
                this.logger.debug(`Controller created`);
                
            
                let methodHandler = null;
                let controllerHandler = null;
                switch(req.method) {
                    case "GET":
                    methodHandler = controller.get;
                    controllerHandler = (controller: Controller, req: Request, id?: any)=>controller.get(req, id);
                    break;
                    case "POST":
                    methodHandler = controller.post;
                    controllerHandler = (controller: Controller, req: Request, id?: any)=>controller.post(req, id);
                    break;
                    case "PUT":
                    methodHandler = controller.put;
                    controllerHandler = (controller: Controller, req: Request, id?: any)=>controller.put(req, id);
                    break;
                    case "DELETE":
                    methodHandler = controller.delete;
                    controllerHandler = (controller: Controller, req: Request, id?: any)=>controller.delete(req, id);
                    break;
                }

                let response: any;
                const id = req.params.id;
                if (this.security && methodHandler) {
                    await this.security.checkSecurity(req, methodHandler);
                }

                if (id) {
                    response = await controllerHandler(controller, req, id);
                } else {
                    response = await controllerHandler(controller, req);
                }

                if (response) {
                    if(response instanceof FileResponse) {
                        res.status(200).sendFile(response.filename);
                    } else{
                        res.status(200).json(response);
                    }
                    
                    this.logger.debug(`Response: \n ${JSON.stringify(response)}`);
                } else {
                    res.sendStatus(204);
                }
                this.logger.info(`Response sent`);
            } catch (err) {
                if (err.responsecode && err.responsecode < 600) {
                    res.status(err.responsecode).json({message: err.message});
                    this.logger.info(`Controller return error code '${err.responsecode}'`);
                } else {
                    res.status(500).json({message: err.message, stack: err.stack });
                    this.logger.error(`Unhandled error '${err.message}' in path ${req.originalUrl} `, {error: err});
                }
            } finally {
                this.logger.debug('Postprocessing request');
                this.requestPostProcess(container, req);
                container.unbind(ObserverListener);
                container.unbindAll();
                container.unload();
            }

        };
    }

    protected requestPostProcess(container: Container, req: Request) {
        const observerListener = container.get<ObserverListener>(ObserverListener)
        this.handleRepositoryChanges(container, observerListener);
    }


    private handleRepositoryChanges(container: Container, observerListener: ObserverListener) {
        const observers = container.getAll<RepositoryObserver>(this.repositoryObserverType);
        observerListener.observe(observers);
    }
}
