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
const content_1 = require("../models/content");
const error_exception_1 = require("../core/error.exception");
const repository_lang_1 = require("../core/repository/repository.lang");
const repository_observer_1 = require("../core/repository/repository.observer");
const route_1 = require("../models/route");
const getid_1 = require("../extensions/getid");
let ContentController = class ContentController {
    constructor(repository) {
        this.repository = repository;
    }
    async get(req, id) {
        if (id) {
            let res;
            if (req.query.byroute && req.query.byroute === 'true') {
                const contents = await this.repository.Get(e => e.find({ route: id }));
                if (contents.length > 0) {
                    res = contents[0];
                }
            }
            else {
                res = await this.repository.GetById(id);
            }
            if (!res) {
                throw new error_exception_1.AppError(404, `id isn't found`);
            }
            return res;
        }
        const res = await this.repository.Get(e => e.find().populate('route'));
        return res;
    }
    post(req, id) {
        throw new error_exception_1.AppError(404, `Not Found`);
    }
    async put(req, id) {
        if (!req.body.content || !req.body.content._id) {
            throw new error_exception_1.AppError(400, "Bad Request");
        }
        const c = req.body.content;
        return await this.repository.Update(req.body.content._id, c);
    }
    delete(req, id) {
        throw new error_exception_1.AppError(404, `Not Found`);
    }
    async onDataChanged(entity_type, entity, event) {
        if (entity_type === route_1.Route && event == repository_observer_1.ObserverEventType.Removed) {
            const route = entity;
            const res = (await this.repository.Get(elem => elem.find({ route: route })))[0];
            if (res) {
                this.repository.Delete(getid_1.getid(res));
            }
        }
    }
};
__decorate([
    security_1.secure(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ContentController.prototype, "put", null);
ContentController = __decorate([
    inversify_1.injectable(),
    __param(0, inversify_1.inject(repository_lang_1.RepositoryLang.of(content_1.Content))),
    __metadata("design:paramtypes", [Object])
], ContentController);
exports.ContentController = ContentController;
//# sourceMappingURL=content.controller.js.map