"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const inversify_1 = require("inversify");
require("reflect-metadata");
const jwt = require("jsonwebtoken");
let TokenSecurityPrinciple = class TokenSecurityPrinciple {
    async isAuthorized(req) {
        return new Promise((resolve) => {
            let token = req.headers['x-access-token'];
            if (token) {
                let APP_SECRET = process.env.APP_SECRET;
                if (!APP_SECRET)
                    APP_SECRET = 'DEF_SECRET';
                jwt.verify(token, APP_SECRET, function (err, decoded) {
                    if (err) {
                        resolve(false);
                    }
                    resolve(true);
                });
            }
            else {
                resolve(false);
            }
        });
    }
};
TokenSecurityPrinciple = __decorate([
    inversify_1.injectable()
], TokenSecurityPrinciple);
exports.TokenSecurityPrinciple = TokenSecurityPrinciple;
//# sourceMappingURL=token.security.principle.js.map