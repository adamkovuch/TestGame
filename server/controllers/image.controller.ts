import { Request } from 'express';
import { Controller } from '../core/controller';
import { injectable } from 'inversify';
import 'reflect-metadata';
import { secure } from '../core/security';
import { AppError } from '../core/error.exception';
import { RepositoryObserver, ObserverEventType } from '../core/repository/repository.observer';
import { ImageProcess } from '../helpers/image.process';

@injectable()
export class ImageController implements Controller, RepositoryObserver {
    constructor(
        private extImage: ImageProcess) {
    }
    
    async get(req: Request, id?: any) {
        throw new AppError(404, 'Not Found');
    }

    @secure()
    async post(req: Request, id?: any) {
        let uploadedFiles = (req as any).files;

        if(!uploadedFiles || !uploadedFiles.image) throw new AppError(400, 'Bad Request');

        const image = uploadedFiles.image;
        const img = await this.extImage.uploadImage(image);

        if(req.body.order) {
            img.order = +req.body.order;
        }

        let name:string = uploadedFiles.image.name;
        name = name.split('.')[0];
        if(name) {
            const parts = name.split('_');
            const order = parseInt(parts[parts.length-1]);
            if(order !== NaN) {
                img.order = order;
            }
        }
        
        return img;
    }

    @secure()
    async put(req: Request, id?: any) {
        throw new AppError(404, 'Not Found');
    }

    @secure()
    async delete(req: Request, id?: any) {
        if(!id) throw new AppError(400, 'Bad Request');

        await this.extImage.delete(id);
    }

    onDataChanged(entity_type: any, entity: any, event: ObserverEventType) {
    }
}