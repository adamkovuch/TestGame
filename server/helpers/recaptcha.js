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
Object.defineProperty(exports, "__esModule", { value: true });
var ReCaptcha_1;
const got = require("got");
const logger_1 = require("../core/logger");
const inversify_1 = require("inversify");
let ReCaptcha = ReCaptcha_1 = class ReCaptcha {
    constructor() {
        this.secret_key = '';
        this.logger = logger_1.getLogger(ReCaptcha_1);
        if (!process.env.RECAPTCHA_SECRET_PRIVATE) {
            this.logger.warn(`recaptcha_secret isn't set. ReCaptcha may not work`);
        }
    }
    async validateCaptcha(token) {
        this.logger.debug('Validating captcha token');
        const res = await got.post('https://www.google.com/recaptcha/api/siteverify', {
            json: true,
            query: {
                secret: process.env.RECAPTCHA_SECRET_PRIVATE,
                response: token
            }
        });
        if (res.body.success)
            return true;
        return false;
    }
};
ReCaptcha = ReCaptcha_1 = __decorate([
    inversify_1.injectable(),
    __metadata("design:paramtypes", [])
], ReCaptcha);
exports.ReCaptcha = ReCaptcha;
//# sourceMappingURL=recaptcha.js.map