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
var ImageProcess_1;
const inversify_1 = require("inversify");
const providers_1 = require("../config/providers");
const logger_1 = require("../core/logger");
const appRoot = require("app-root-path");
const path = require("path");
const fs = require("fs");
const got = require("got");
const image_watermark_1 = require("./image.watermark");
let ImageProcess = ImageProcess_1 = class ImageProcess {
    constructor(service, watermark) {
        this.service = service;
        this.watermark = watermark;
        this.uploadDir = 'tmp';
        this.rootDir = appRoot.path;
        this.logger = logger_1.getLogger(ImageProcess_1);
        this.prepareFolder();
    }
    async uploadImage(image) {
        const filename = await this.createFileLocally(image);
        await this.watermark.processImageWatermark(filename);
        const img = await this.service.upload(filename);
        this.deleteFileLocally(filename);
        return img;
    }
    delete(id) {
        return this.service.delete(id);
    }
    async createFileLocally(file) {
        const filename = this.makeName(file.name);
        const savepath = path.join(this.rootDir, this.uploadDir, filename);
        await file.mv(savepath);
        return savepath;
    }
    deleteFileLocally(filename) {
        fs.unlink(filename, function (err) {
        });
    }
    makeName(filename) {
        let fileParts = filename.split('.');
        let file_ext = fileParts[fileParts.length - 1];
        filename = fileParts.slice(0, -1).join('.');
        const now = new Date();
        var formated_date = `${now.getFullYear()}_${now.getMonth()}_${now.getDate()}_${now.getHours()}_${now.getMinutes()}_${now.getSeconds()}_${now.getMilliseconds()}`;
        filename = `${filename}_${formated_date}.${file_ext}`;
        return filename;
    }
    async prepareFolder() {
        const p = path.join(this.rootDir, this.uploadDir);
        if (!fs.existsSync(p)) {
            fs.mkdirSync(p);
            this.logger.debug('Folder created');
        }
    }
    download(link, filename) {
        return new Promise(async (resolve) => {
            const file = fs.createWriteStream(path.join(this.rootDir, this.uploadDir, filename));
            const res = await got.stream(link).pipe(file);
            res.on('finish', () => {
                res.close();
                resolve(file.path);
                this.logger.debug(`File '${file.path}' downloaded`);
            });
        });
    }
};
ImageProcess = ImageProcess_1 = __decorate([
    inversify_1.injectable(),
    __param(0, inversify_1.inject(providers_1.MainProviders.image)),
    __metadata("design:paramtypes", [Object, image_watermark_1.ImageEditor])
], ImageProcess);
exports.ImageProcess = ImageProcess;
//# sourceMappingURL=image.process.js.map