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
require("reflect-metadata");
const security_1 = require("../core/security");
const error_exception_1 = require("../core/error.exception");
const repository_observer_1 = require("../core/repository/repository.observer");
const portfolio_content_1 = require("../models/portfolio.content");
const portfolio_item_1 = require("../models/portfolio.item");
const image_process_1 = require("../helpers/image.process");
let ImageController = class ImageController {
    constructor(extImage) {
        this.extImage = extImage;
    }
    async get(req, id) {
        throw new error_exception_1.AppError(404, 'Not Found');
    }
    async post(req, id) {
        let uploadedFiles = req.files;
        if (!uploadedFiles || !uploadedFiles.image)
            throw new error_exception_1.AppError(400, 'Bad Request');
        const image = uploadedFiles.image;
        const img = await this.extImage.uploadImage(image);
        if (req.body.order) {
            img.order = +req.body.order;
        }
        let name = uploadedFiles.image.name;
        name = name.split('.')[0];
        if (name) {
            const parts = name.split('_');
            const order = parseInt(parts[parts.length - 1]);
            if (order !== NaN) {
                img.order = order;
            }
        }
        return img;
    }
    async put(req, id) {
        throw new error_exception_1.AppError(404, 'Not Found');
    }
    async delete(req, id) {
        if (!id)
            throw new error_exception_1.AppError(400, 'Bad Request');
        await this.extImage.delete(id);
    }
    onDataChanged(entity_type, entity, event) {
        if (entity_type == portfolio_content_1.PortfolioContent && event == repository_observer_1.ObserverEventType.Removed) {
            const content = entity;
            if (content.type == 'image') {
                this.extImage.delete(content.data.imageId);
            }
            else if (content.type == 'object3d') {
                const images = content.data;
                images.forEach(elem => {
                    this.extImage.delete(elem.imageId);
                });
            }
        }
        else if (entity_type == portfolio_item_1.PortfolioItem && event == repository_observer_1.ObserverEventType.Removed) {
            const item = entity;
            if (item.thumbnail) {
                this.extImage.delete(item.thumbnail.imageId);
            }
        }
    }
};
__decorate([
    security_1.secure(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ImageController.prototype, "post", null);
__decorate([
    security_1.secure(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ImageController.prototype, "put", null);
__decorate([
    security_1.secure(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ImageController.prototype, "delete", null);
ImageController = __decorate([
    inversify_1.injectable(),
    __metadata("design:paramtypes", [image_process_1.ImageProcess])
], ImageController);
exports.ImageController = ImageController;
//# sourceMappingURL=image.controller.js.map