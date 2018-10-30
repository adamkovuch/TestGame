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
const admin_user_1 = require("../../models/admin.user");
const error_exception_1 = require("../error.exception");
const security_1 = require("../security");
const bcrypt = require("bcryptjs");
const repository_data_1 = require("../repository/repository.data");
let AdminUserController = class AdminUserController {
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
        else {
            const res = await this.repository.Get();
            if (res) {
                return res;
            }
        }
        throw new error_exception_1.AppError(404, 'not found');
    }
    async post(req) {
        const entity = new admin_user_1.AdminUser();
        if (req.body.user.name &&
            req.body.user.login &&
            req.body.user.password) {
            if (req.body.user.email) {
                entity.email = req.body.user.email;
            }
            entity.login = req.body.user.login;
            entity.name = req.body.user.name;
            entity.salt = await bcrypt.genSalt(10);
            entity.hash = await bcrypt.hash(req.body.user.password, entity.salt);
            try {
                return await this.repository.Add(entity);
            }
            catch (err) {
                throw new error_exception_1.AppError(400, 'Bad request');
            }
        }
        else {
            throw new error_exception_1.AppError(400, 'Bad request');
        }
    }
    async put(req, id) {
        const entity = new admin_user_1.AdminUser();
        if (req.body.user.name &&
            req.body.user.login &&
            req.body.user._id) {
            if (req.body.user.email) {
                entity.email = req.body.user.email;
            }
            entity.login = req.body.user.login;
            entity.name = req.body.user.name;
            if (req.body.user.password) {
                entity.salt = await bcrypt.genSalt(10);
                entity.hash = await bcrypt.hash(req.body.user.password, entity.salt);
            }
            else {
                delete entity.salt;
                delete entity.hash;
            }
            try {
                return await this.repository.Update(id, entity);
            }
            catch (err) {
                throw new error_exception_1.AppError(400, 'Bad request');
            }
        }
        else {
            throw new error_exception_1.AppError(400, 'Bad request');
        }
    }
    async delete(req, id) {
        return await this.repository.Delete(id);
    }
};
__decorate([
    security_1.secure(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminUserController.prototype, "post", null);
__decorate([
    security_1.secure(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AdminUserController.prototype, "put", null);
__decorate([
    security_1.secure(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AdminUserController.prototype, "delete", null);
AdminUserController = __decorate([
    inversify_1.injectable(),
    __param(0, inversify_1.inject(repository_data_1.RepositoryData.of(admin_user_1.AdminUser))),
    __metadata("design:paramtypes", [Object])
], AdminUserController);
exports.AdminUserController = AdminUserController;
//# sourceMappingURL=admin.user.controller.js.map