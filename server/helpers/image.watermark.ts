import { injectable } from "inversify";
import { SettingService } from "./setting.service";
import * as appRoot from 'app-root-path';
import * as path from 'path';
import { getLogger } from "../core/logger";

const jimp = require('jimp');
//import * as jimp from 'jimp';

@injectable()
export class ImageEditor{

    private readonly font = "dist/assets/fonts/open-sans-64-white.fnt";
    private logger = getLogger(ImageEditor);

    constructor(private settingService: SettingService) {
    }

    async textWatermark(filename: string, text: string) {
        const font = await jimp.loadFont(path.join(appRoot.path, this.font));

        let img = await jimp.read(filename);

        img = await img.print(font, -20, -20, {
            text: text,
            alignmentX: jimp.HORIZONTAL_ALIGN_RIGHT,
            alignmentY: jimp.VERTICAL_ALIGN_BOTTOM
        }, img.bitmap.width, img.bitmap.height)

        await img.writeAsync(filename);
        this.logger.debug('Watermark for image created');
    }

    async resize(filename:string, width: number, height: number) {
        let img = await jimp.read(filename);
        img = await img.scaleToFit(width, height);
        await img.writeAsync(filename);
        this.logger.debug('Image resized');
    }

    async processImageWatermark(filename: string) {
        this.logger.debug('Processing uploaded image');

        await this.settingService.load();
        if(!this.settingService.get('image_watermark_enabled')) {
            this.logger.debug('Watermark is disabled');
            return;
        }

        let water_text = this.settingService.get('image_watermark_text');
        if(!water_text || water_text === '') {
            water_text = this.settingService.get('site_name');
        }
        const text = '© '+ water_text;

        await this.textWatermark(filename, text);
    }
}