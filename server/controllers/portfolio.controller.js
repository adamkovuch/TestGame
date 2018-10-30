"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
const inversify_1 = require("inversify");
require("reflect-metadata");
const security_1 = require("../core/security");
const error_exception_1 = require("../core/error.exception");
const repository_lang_1 = require("../core/repository/repository.lang");
const portfolio_item_1 = require("../models/portfolio.item");
const route_1 = require("../models/route");
const getid_1 = require("../extensions/getid");
const repository_observer_1 = require("../core/repository/repository.observer");
let PortfolioController = class PortfolioController {
    constructor(repository, routerepository) {
        this.repository = repository;
        this.routerepository = routerepository;
    }
    async get(req, id) {
        if (id) {
            let res;
            if (req.query.byroute && req.query.byroute === 'true') {
                const contents = await this.repository.Get(e => e.find({ route: id }).populate('content'));
                if (contents.length > 0) {
                    res = contents[0];
                }
            }
            else if (req.query.byportfolioroute && req.query.byportfolioroute === 'true') {
                return await this.repository.Get(e => e.find({ portfolioRoute: id }));
            }
            else {
                res = await this.repository.GetById(id, elem => elem.find().populate('content'));
            }
            if (!res) {
                throw new error_exception_1.AppError(404, `id isn't found`);
            }
            return res;
        }
        return await this.repository.Get(e => e.find().populate('-content'));
    }
    async post(req, id) {
        if (!req.body.portfolio || !req.body.portfolio.name || !req.body.portfolio.link || !req.body.portfolio.portfolioRoute) {
            throw new error_exception_1.AppError(400, "Bad Request");
        }
        if (!req.body.portfolio.description) {
            req.body.portfolio.description = '';
        }
        const item = req.body.portfolio;
        if (!item.route) {
            const parentRoute = await this.routerepository.GetById(req.body.portfolio.portfolioRoute);
            if (!parentRoute) {
                throw new error_exception_1.AppError(400, "Bad Request");
            }
            let route = new route_1.Route();
            route.name = item.name;
            route.visible = false;
            route.position = 1000;
            route.alias = parentRoute.alias + '/' + item.link;
            route.component = 'portfolioitem';
            route = await this.routerepository.Add(route);
            item.route = getid_1.getid(route);
        }
        return await this.repository.Add(item);
    }
    async put(req, id) {
        if (!req.body.portfolio || !id) {
            throw new error_exception_1.AppError(400, "Bad Request");
        }
        const item = req.body.portfolio;
        return await this.repository.Update(id, item);
    }
    async delete(req, id) {
        if (!id) {
            throw new error_exception_1.AppError(400, "Bad Request");
        }
        await this.deletePortfolio(id);
    }
    async deletePortfolio(id) {
        const item = await this.repository.GetById(id);
        this.routerepository.Delete(item.route);
        await this.repository.Delete(id);
    }
    async onDataChanged(entity_type, entity, event) {
        if (entity_type === route_1.Route && event == repository_observer_1.ObserverEventType.Removed) {
            const route = entity;
            let res = (await this.repository.Get(elem => elem.find({ portfolioRoute: route })));
            res.forEach(elem => {
                this.deletePortfolio(getid_1.getid(elem));
            });
            res = (await this.repository.Get(elem => elem.find({ route: route })));
            res.forEach(elem => {
                this.deletePortfolio(getid_1.getid(elem));
            });
        }
    }
};
__decorate([
    security_1.secure(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PortfolioController.prototype, "post", null);
__decorate([
    security_1.secure(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PortfolioController.prototype, "put", null);
__decorate([
    security_1.secure(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PortfolioController.prototype, "delete", null);
PortfolioController = __decorate([
    inversify_1.injectable(),
    __param(0, inversify_1.inject(repository_lang_1.RepositoryLang.of(portfolio_item_1.PortfolioItem))),
    __param(1, inversify_1.inject(repository_lang_1.RepositoryLang.of(route_1.Route))),
    __metadata("design:paramtypes", [Object, Object])
], PortfolioController);
exports.PortfolioController = PortfolioController;
//# sourceMappingURL=portfolio.controller.js.map