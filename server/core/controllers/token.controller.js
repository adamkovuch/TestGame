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
const jwt = require("jsonwebtoken");
const inversify_1 = require("inversify");
require("reflect-metadata");
const error_exception_1 = require("../error.exception");
const admin_user_1 = require("../../models/admin.user");
const bcrypt = require("bcryptjs");
const repository_data_1 = require("../repository/repository.data");
let TokenController = class TokenController {
    constructor(adminUserRepository) {
        this.adminUserRepository = adminUserRepository;
        this.APP_SECRET = process.env.APP_SECRET;
        if (!this.APP_SECRET) {
            this.APP_SECRET = 'DEF_SECRET';
        }
    }
    async get(req, id) {
        return await new Promise((resolve) => {
            const token = req.headers['x-access-token'];
            if (token) {
                jwt.verify(token, this.APP_SECRET, function (err, decoded) {
                    if (err) {
                        throw new error_exception_1.AppError(400, 'Bad Request');
                    }
                    resolve(decoded);
                });
            }
            throw new error_exception_1.AppError(400, 'Bad Request');
        });
    }
    async post(req, id) {
        if (req.body.login && req.body.password) {
            const res = await this.adminUserRepository.Get(e => e.find({ login: req.body.login }));
            if (res.length > 0) {
                const user = res[0];
                const passOk = await bcrypt.compare(req.body.password, user.hash);
                if (passOk) {
                    return this.getToken(user._id);
                }
            }
        }
        return null;
    }
    async put(req, id) {
        if (id) {
            return new Promise((resolve) => {
                jwt.verify(req.body.access_token, this.APP_SECRET, (err, decoded) => {
                    if (err) {
                        throw new error_exception_1.AppError(400, 'Bad Request');
                    }
                    resolve(this.getToken(decoded.userid));
                });
            });
        }
        throw new error_exception_1.AppError(400, 'Bad Request');
    }
    delete(req, id) {
        throw new error_exception_1.AppError(404, 'Not Found');
    }
    getToken(id) {
        const expiresIn = 86400;
        const key = jwt.sign({ userid: id }, this.APP_SECRET, {
            expiresIn: expiresIn // expires in 24 hours
        });
        const d = new Date();
        d.setSeconds(d.getSeconds() + expiresIn);
        const token = {
            access_token: key,
            token_type: 'bearer',
            expires_in: d,
            userid: id
        };
        return token;
    }
};
TokenController = __decorate([
    inversify_1.injectable(),
    __param(0, inversify_1.inject(repository_data_1.RepositoryData.of(admin_user_1.AdminUser))),
    __metadata("design:paramtypes", [Object])
], TokenController);
exports.TokenController = TokenController;
//# sourceMappingURL=token.controller.js.map