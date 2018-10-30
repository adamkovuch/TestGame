import { injectable, inject } from "inversify";
import { ImageUpload } from "./image/imageupload";
import { MainProviders } from "../config/providers";
import { getLogger } from "../core/logger";
import * as appRoot from 'app-root-path';
import * as path from 'path';
import * as fs from 'fs';
import * as got from 'got';
import { ImageEditor } from "./image.watermark";
import { Image } from "../models/image";

@injectable()
export class ImageProcess {
    uploadDir = 'tmp';

    private rootDir = appRoot.path;
    private logger = getLogger(ImageProcess);

    constructor(@inject(MainProviders.image) private service: ImageUpload,
        private watermark: ImageEditor) {
        this.prepareFolder();
    }

    async uploadImage(image: any): Promise<Image> {
        const filename = await this.createFileLocally(image);

        await this.watermark.processImageWatermark(filename);

        const img = await this.service.upload(filename);
        this.deleteFileLocally(filename);
        return img;
    }

    delete(id: any) {
        return this.service.delete(id);
    }

    private async createFileLocally(file) {
        const filename = this.makeName(file.name);

        const savepath = path.join(this.rootDir, this.uploadDir, filename);
        await file.mv(savepath);
        return savepath;
    }

    private deleteFileLocally(filename) {
        fs.unlink(filename, function(err) {
        });
    }

    private makeName(filename: string):string {
        let fileParts = filename.split('.');
        let file_ext = fileParts[fileParts.length-1];
        filename = fileParts.slice(0, -1).join('.');
        const now = new Date();
        var formated_date = `${now.getFullYear()}_${now.getMonth()}_${now.getDate()}_${now.getHours()}_${now.getMinutes()}_${now.getSeconds()}_${now.getMilliseconds()}`;
        filename = `${filename}_${formated_date}.${file_ext}`; 
        return filename;
    }

    private async prepareFolder() {
        const p = path.join(this.rootDir, this.uploadDir);

        if (!fs.existsSync(p)){
            fs.mkdirSync(p);
            this.logger.debug('Folder created');
        }
    }

    download(link: string, filename: string) {
        return new Promise<string>(async (resolve)=>{
            const file = fs.createWriteStream(path.join(this.rootDir, this.uploadDir, filename));
            const res = await got.stream(link).pipe(file);
            res.on('finish', ()=> {
                res.close();
                resolve(<string>file.path);
                this.logger.debug(`File '${file.path}' downloaded`);
            });
        });
    }
}