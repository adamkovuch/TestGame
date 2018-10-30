import { Request} from 'express';
import { Controller } from '../controller';
import { injectable, inject } from 'inversify';
import 'reflect-metadata';
import { Image } from '../../models/image';
import { secure } from '../security';
import { AppError } from '../error.exception';
import { ImageEditor } from '../../helpers/image.watermark';
import { SettingService } from '../../helpers/setting.service';
import { FileResponse } from '../models/file.response';
import { ObserverEventType, RepositoryObserver } from '../repository/repository.observer';
import { Setting } from '../../models/setting';
import * as appRoot from 'app-root-path';
import * as path from 'path';
import { ImageProcess } from '../../helpers/image.process';

@injectable()
export class FaviconController implements Controller, RepositoryObserver {
    constructor(
        private extImage: ImageProcess,
        private watermark: ImageEditor,
        private setting: SettingService) {
    }
    
    static cachedFiles: string[] = [];

    async get(req: Request, id?: any) {
    
        let width = 0;
        let height = 0;
        if(!req.query.size) {
            req.query.size = "64X64";
        } else {
            const parts: string[] = req.query.size.toUpperCase().split('X');
            width = parseInt(parts[0]);
            height = parseInt(parts[1]);

            if(width == NaN || height == NaN) {
                throw new AppError(400, 'Bad Request');
            }
        }
        const filename = "favicon_"+req.query.size+'.png';

        if(!FaviconController.cachedFiles[filename]) {
            const res = await this.loadFavicon(filename,width, height);
            FaviconController.cachedFiles[filename] = res;
        }

        return new FileResponse(FaviconController.cachedFiles[filename]);
    }

    private async loadFavicon(filename: string, width: number, height: number) {
        await this.setting.load();
        const img:Image = this.setting.get('favicon');

        if(img) {
            const createdFile = await this.extImage.download(img.src, filename);
            await this.watermark.resize(createdFile, width, height);
            return createdFile;
        } else {
            const createdFile = path.join(appRoot.path, 'dist/favicon.ico')
            return createdFile;
        }
    }

    @secure()
    async post(req: Request, id?: any) {
        throw new AppError(404, 'Not Found');
    }

    @secure()
    async put(req: Request, id?: any) {
        throw new AppError(404, 'Not Found');
    }

    @secure()
    async delete(req: Request, id?: any) {
        throw new AppError(404, 'Not Found');
    }

    onDataChanged(entity_type: any, entity: any, event: ObserverEventType) {
        if(entity_type == Setting) {
            const setting:Setting = entity;
            if(setting.key === 'favicon') {
                FaviconController.cachedFiles = [];
            }
        }
    }
}