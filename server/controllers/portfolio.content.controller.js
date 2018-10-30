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
const portfolio_content_1 = require("../models/portfolio.content");
const repository_observer_1 = require("../core/repository/repository.observer");
let PortfolioContentController = class PortfolioContentController {
    constructor(repository) {
        this.repository = repository;
    }
    async get(req, id) {
        if (id) {
            const res = await this.repository.GetById(id);
            if (res) {
                return res;
            }
        }
        throw new error_exception_1.AppError(404, "Not found");
    }
    async post(req, id) {
        if (!req.body.content) {
            throw new error_exception_1.AppError(400, "Bad Request");
        }
        const content = req.body.content;
        return await this.repository.Add(content);
    }
    async put(req, id) {
        if (!req.body.content || !id) {
            throw new error_exception_1.AppError(400, "Bad Request");
        }
        const content = req.body.content;
        return await this.repository.Update(id, content);
    }
    async delete(req, id) {
        if (!id) {
            throw new error_exception_1.AppError(400, "Bad Request");
        }
        await this.repository.Delete(id);
    }
    async onDataChanged(entity_type, entity, event) {
        if (entity_type === portfolio_item_1.PortfolioItem && event == repository_observer_1.ObserverEventType.Removed) {
            const portfolioItem = entity;
            portfolioItem.content.forEach(elem => {
                this.repository.Delete(elem);
            });
        }
    }
};
__decorate([
    security_1.secure(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PortfolioContentController.prototype, "post", null);
__decorate([
    security_1.secure(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PortfolioContentController.prototype, "put", null);
__decorate([
    security_1.secure(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PortfolioContentController.prototype, "delete", null);
PortfolioContentController = __decorate([
    inversify_1.injectable(),
    __param(0, inversify_1.inject(repository_lang_1.RepositoryLang.of(portfolio_content_1.PortfolioContent))),
    __metadata("design:paramtypes", [Object])
], PortfolioContentController);
exports.PortfolioContentController = PortfolioContentController;
//# sourceMappingURL=portfolio.content.controller.js.map