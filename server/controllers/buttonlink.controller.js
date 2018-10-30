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
const buttonlink_1 = require("../models/buttonlink");
const repository_observer_1 = require("../core/repository/repository.observer");
const route_1 = require("../models/route");
const getid_1 = require("../extensions/getid");
let ButtonLinkController = class ButtonLinkController {
    constructor(repository) {
        this.repository = repository;
    }
    async get(req, id) {
        if (id) {
            let res;
            if (req.query.byroute && req.query.byroute === 'true') {
                const buttons = await this.repository.Get(e => e.find({ route: id }));
                if (buttons.length > 0) {
                    res = buttons[0];
                }
            }
            else {
                res = await this.repository.GetById(id);
            }
            if (res) {
                return res;
            }
        }
        else {
            const res = await this.repository.Get();
            return res;
        }
    }
    async post(req, id) {
        if (!req.body.buttonlink || !req.body.buttonlink.title || !req.body.buttonlink.link || !req.body.buttonlink.route) {
            throw new error_exception_1.AppError(400, "Bad Request");
        }
        const data = req.body.buttonlink;
        return await this.repository.Add(data);
    }
    async put(req, id) {
        if (!id || !req.body.buttonlink || !req.body.buttonlink._id) {
            throw new error_exception_1.AppError(400, "Bad Request");
        }
        const data = req.body.buttonlink;
        return await this.repository.Update(id, data);
    }
    async delete(req, id) {
        if (!id) {
            throw new error_exception_1.AppError(400, "Bad Request");
        }
        await this.repository.Delete(id);
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
], ButtonLinkController.prototype, "post", null);
__decorate([
    security_1.secure(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ButtonLinkController.prototype, "put", null);
__decorate([
    security_1.secure(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ButtonLinkController.prototype, "delete", null);
ButtonLinkController = __decorate([
    inversify_1.injectable(),
    __param(0, inversify_1.inject(repository_lang_1.RepositoryLang.of(buttonlink_1.ButtonLink))),
    __metadata("design:paramtypes", [Object])
], ButtonLinkController);
exports.ButtonLinkController = ButtonLinkController;
//# sourceMappingURL=buttonlink.controller.js.map