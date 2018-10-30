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
var Cloudinary_1;
const logger_1 = require("../../core/logger");
const inversify_1 = require("inversify");
const image_1 = require("../../models/image");
const cloudinary = require("cloudinary");
let Cloudinary = Cloudinary_1 = class Cloudinary {
    constructor() {
        this.logger = logger_1.getLogger(Cloudinary_1);
    }
    async upload(filename) {
        const savepath = filename;
        const server_res = await this.uploadToServer(savepath);
        let img = new image_1.Image();
        img.imageId = server_res.public_id;
        img.src = server_res.secure_url;
        return img;
    }
    uploadToServer(imgPath) {
        return new Promise((resolve, reject) => {
            cloudinary.uploader.upload(imgPath, (result) => {
                this.logger.debug(`Image '${imgPath}' uploaded`);
                resolve(result);
            });
        });
    }
    async delete(id) {
        return new Promise((resolve, reject) => {
            cloudinary.v2.api.delete_resources([id], (error, result) => {
                if (!error) {
                    this.logger.debug(`Image '${id}' was deleted`);
                    resolve();
                }
                else {
                    this.logger.error(`Can't delete image. ` + error);
                    reject(error);
                }
            });
        });
    }
};
Cloudinary = Cloudinary_1 = __decorate([
    inversify_1.injectable(),
    __metadata("design:paramtypes", [])
], Cloudinary);
exports.Cloudinary = Cloudinary;
//# sourceMappingURL=cloudinary.js.map