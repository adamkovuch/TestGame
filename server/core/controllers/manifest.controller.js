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
const inversify_1 = require("inversify");
const setting_service_1 = require("../../helpers/setting.service");
const security_1 = require("../security");
const error_exception_1 = require("../error.exception");
let ManifestController = class ManifestController {
    constructor(setting) {
        this.setting = setting;
    }
    async get(req, id) {
        await this.setting.load();
        const manifest = {
            name: this.setting.get('site_name'),
            short_name: this.setting.get('site_name'),
            display: "standalone",
            description: this.setting.get('site_description'),
            scope: '/',
            splash_pages: null,
            start_url: '/',
            icons: [
                { type: "image/png", sizes: "72x72", src: "/api/favicon?size=72x72" },
                { type: "image/png", sizes: "96x96", src: "/api/favicon?size=96x96" },
                { type: "image/png", sizes: "128x128", src: "/api/favicon?size=128x128" },
                { type: "image/png", sizes: "144x144", src: "/api/favicon?size=144x144" },
                { type: "image/png", sizes: "152x152", src: "/api/favicon?size=152x152" },
                { type: "image/png", sizes: "192x192", src: "/api/favicon?size=192x192" },
                { type: "image/png", sizes: "384x384", src: "/api/favicon?size=384x384" },
                { type: "image/png", sizes: "512x512", src: "/api/favicon?size=512x512" }
            ]
        };
        return manifest;
    }
    async post(req, id) {
        throw new error_exception_1.AppError(404, 'Not Found');
    }
    async put(req, id) {
        throw new error_exception_1.AppError(404, 'Not Found');
    }
    async delete(req, id) {
        throw new error_exception_1.AppError(404, 'Not Found');
    }
};
__decorate([
    security_1.secure(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ManifestController.prototype, "post", null);
__decorate([
    security_1.secure(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ManifestController.prototype, "put", null);
__decorate([
    security_1.secure(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ManifestController.prototype, "delete", null);
ManifestController = __decorate([
    inversify_1.injectable(),
    __metadata("design:paramtypes", [setting_service_1.SettingService])
], ManifestController);
exports.ManifestController = ManifestController;
//# sourceMappingURL=manifest.controller.js.map