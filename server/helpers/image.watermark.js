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
var ImageEditor_1;
const inversify_1 = require("inversify");
const setting_service_1 = require("./setting.service");
const appRoot = require("app-root-path");
const path = require("path");
const logger_1 = require("../core/logger");
const jimp = require('jimp');
//import * as jimp from 'jimp';
let ImageEditor = ImageEditor_1 = class ImageEditor {
    constructor(settingService) {
        this.settingService = settingService;
        this.font = "dist/assets/fonts/open-sans-64-white.fnt";
        this.logger = logger_1.getLogger(ImageEditor_1);
    }
    async textWatermark(filename, text) {
        const font = await jimp.loadFont(path.join(appRoot.path, this.font));
        let img = await jimp.read(filename);
        img = await img.print(font, -20, -20, {
            text: text,
            alignmentX: jimp.HORIZONTAL_ALIGN_RIGHT,
            alignmentY: jimp.VERTICAL_ALIGN_BOTTOM
        }, img.bitmap.width, img.bitmap.height);
        await img.writeAsync(filename);
        this.logger.debug('Watermark for image created');
    }
    async resize(filename, width, height) {
        let img = await jimp.read(filename);
        img = await img.scaleToFit(width, height);
        await img.writeAsync(filename);
        this.logger.debug('Image resized');
    }
    async processImageWatermark(filename) {
        this.logger.debug('Processing uploaded image');
        await this.settingService.load();
        if (!this.settingService.get('image_watermark_enabled')) {
            this.logger.debug('Watermark is disabled');
            return;
        }
        let water_text = this.settingService.get('image_watermark_text');
        if (!water_text || water_text === '') {
            water_text = this.settingService.get('site_name');
        }
        const text = '© ' + water_text;
        await this.textWatermark(filename, text);
    }
};
ImageEditor = ImageEditor_1 = __decorate([
    inversify_1.injectable(),
    __metadata("design:paramtypes", [setting_service_1.SettingService])
], ImageEditor);
exports.ImageEditor = ImageEditor;
//# sourceMappingURL=image.watermark.js.map