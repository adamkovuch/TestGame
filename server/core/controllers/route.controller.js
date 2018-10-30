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
const security_1 = require("../security");
const error_exception_1 = require("../error.exception");
const route_1 = require("../../models/route");
const content_1 = require("../../models/content");
const repository_lang_1 = require("../repository/repository.lang");
const getid_1 = require("../../extensions/getid");
const portfolio_item_1 = require("../../models/portfolio.item");
const repository_observer_1 = require("../repository/repository.observer");
let RouteController = class RouteController {
    constructor(repository, contentRepository) {
        this.repository = repository;
        this.contentRepository = contentRepository;
    }
    async get(req, id) {
        if (id) {
            const res = await this.repository.GetById(id);
            if (!res) {
                throw new error_exception_1.AppError(404, `id isn't found`);
            }
            return res;
        }
        const res = await this.repository.Get();
        return res;
    }
    async post(req, id) {
        if (!req.body.route) {
            throw new error_exception_1.AppError(400, "Bad Request");
        }
        let c = req.body.route;
        if (c.isDefault) {
            await this.removeAllDefaultRoute();
        }
        c = await this.repository.Add(c);
        const content = new content_1.Content();
        content.html = "<p>Hello world<p>";
        content.title = c.name;
        content.route = c._id;
        await this.contentRepository.Add(content);
        return c;
    }
    async put(req, id) {
        if (!req.body.route || !req.body.route._id) {
            throw new error_exception_1.AppError(400, "Bad Request");
        }
        const c = req.body.route;
        if (c.isDefault) {
            await this.removeAllDefaultRoute();
        }
        return await this.repository.Update(id, c);
    }
    async delete(req, id) {
        return await this.repository.Delete(id);
    }
    async removeAllDefaultRoute() {
        const res = await this.repository.Get(e => e.find({ isDefault: true }));
        res.forEach(elem => {
            elem.isDefault = false;
            this.repository.Update(getid_1.getid(elem), elem);
        });
    }
    async onDataChanged(entity_type, entity, event) {
        if (entity_type === portfolio_item_1.PortfolioItem && event == repository_observer_1.ObserverEventType.Modified) {
            const portfolioItem = entity;
            const route = await this.repository.GetById(portfolioItem.route);
            if (route.name !== portfolioItem.name) {
                route.name = portfolioItem.name;
                this.repository.Update(portfolioItem.route, route);
            }
        }
    }
};
__decorate([
    security_1.secure(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], RouteController.prototype, "post", null);
__decorate([
    security_1.secure(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], RouteController.prototype, "put", null);
__decorate([
    security_1.secure(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], RouteController.prototype, "delete", null);
RouteController = __decorate([
    inversify_1.injectable(),
    __param(0, inversify_1.inject(repository_lang_1.RepositoryLang.of(route_1.Route))),
    __param(1, inversify_1.inject(repository_lang_1.RepositoryLang.of(content_1.Content))),
    __metadata("design:paramtypes", [Object, Object])
], RouteController);
exports.RouteController = RouteController;
//# sourceMappingURL=route.controller.js.map