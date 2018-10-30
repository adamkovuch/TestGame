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
const setting_1 = require("../../models/setting");
const repository_data_1 = require("../repository/repository.data");
const getid_1 = require("../../extensions/getid");
let SettingController = class SettingController {
    constructor(repository) {
        this.repository = repository;
    }
    async get(req, id) {
        if (id) {
            if (id === 'env' && req.query.key) {
                switch (req.query.key) {
                    case 'RECAPTCHA_SECRET_PUBLIC':
                        const s1 = new setting_1.Setting();
                        s1.key = 'RECAPTCHA_SECRET_PUBLIC';
                        s1.value = process.env.RECAPTCHA_SECRET_PUBLIC;
                        return s1;
                }
            }
            throw new error_exception_1.AppError(404, 'Not Found');
        }
        return await this.repository.Get();
    }
    async post(req, id) {
        if (!req.body.settings || !req.body.settings.length)
            throw new error_exception_1.AppError(400, 'Bad Request');
        const settings = req.body.settings;
        for (let i in settings) {
            const s = (await this.repository.Get(elem => elem.find({ key: settings[i].key })))[0];
            if (s) {
                await this.repository.Update(getid_1.getid(s), settings[i]);
            }
            else {
                await this.repository.Add(settings[i]);
            }
        }
        return settings;
    }
    async put(req, id) {
        throw new error_exception_1.AppError(404, 'Not found.');
    }
    delete(req, id) {
        throw new error_exception_1.AppError(404, 'Not found.');
    }
};
__decorate([
    security_1.secure(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], SettingController.prototype, "post", null);
SettingController = __decorate([
    inversify_1.injectable(),
    __param(0, inversify_1.inject(repository_data_1.RepositoryData.of(setting_1.Setting))),
    __metadata("design:paramtypes", [Object])
], SettingController);
exports.SettingController = SettingController;
//# sourceMappingURL=setting.controller.js.map