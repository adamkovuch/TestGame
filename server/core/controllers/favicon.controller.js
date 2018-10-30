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
var FaviconController_1;
const inversify_1 = require("inversify");
require("reflect-metadata");
const security_1 = require("../security");
const error_exception_1 = require("../error.exception");
const image_watermark_1 = require("../../helpers/image.watermark");
const setting_service_1 = require("../../helpers/setting.service");
const file_response_1 = require("../models/file.response");
const setting_1 = require("../../models/setting");
const appRoot = require("app-root-path");
const path = require("path");
const image_process_1 = require("../../helpers/image.process");
let FaviconController = FaviconController_1 = class FaviconController {
    constructor(extImage, watermark, setting) {
        this.extImage = extImage;
        this.watermark = watermark;
        this.setting = setting;
    }
    async get(req, id) {
        let width = 0;
        let height = 0;
        if (!req.query.size) {
            req.query.size = "64X64";
        }
        else {
            const parts = req.query.size.toUpperCase().split('X');
            width = parseInt(parts[0]);
            height = parseInt(parts[1]);
            if (width == NaN || height == NaN) {
                throw new error_exception_1.AppError(400, 'Bad Request');
            }
        }
        const filename = "favicon_" + req.query.size + '.png';
        if (!FaviconController_1.cachedFiles[filename]) {
            const res = await this.loadFavicon(filename, width, height);
            FaviconController_1.cachedFiles[filename] = res;
        }
        return new file_response_1.FileResponse(FaviconController_1.cachedFiles[filename]);
    }
    async loadFavicon(filename, width, height) {
        await this.setting.load();
        const img = this.setting.get('favicon');
        if (img) {
            const createdFile = await this.extImage.download(img.src, filename);
            await this.watermark.resize(createdFile, width, height);
            return createdFile;
        }
        else {
            const createdFile = path.join(appRoot.path, 'dist/favicon.ico');
            return createdFile;
        }
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
    onDataChanged(entity_type, entity, event) {
        if (entity_type == setting_1.Setting) {
            const setting = entity;
            if (setting.key === 'favicon') {
                FaviconController_1.cachedFiles = [];
            }
        }
    }
};
FaviconController.cachedFiles = [];
__decorate([
    security_1.secure(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], FaviconController.prototype, "post", null);
__decorate([
    security_1.secure(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], FaviconController.prototype, "put", null);
__decorate([
    security_1.secure(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], FaviconController.prototype, "delete", null);
FaviconController = FaviconController_1 = __decorate([
    inversify_1.injectable(),
    __metadata("design:paramtypes", [image_process_1.ImageProcess,
        image_watermark_1.ImageEditor,
        setting_service_1.SettingService])
], FaviconController);
exports.FaviconController = FaviconController;
//# sourceMappingURL=favicon.controller.js.map