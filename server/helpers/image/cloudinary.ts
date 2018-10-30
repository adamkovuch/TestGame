import { getLogger } from '../../core/logger';
import { injectable } from 'inversify';
import { Image } from '../../models/image';
import * as cloudinary from 'cloudinary';
import { ImageUpload } from './imageupload';

@injectable()
export class Cloudinary implements ImageUpload {
    private logger = getLogger(Cloudinary);
    constructor() {
    }

    async upload(filename:string): Promise<Image> {
        const savepath = filename;
        const server_res = await this.uploadToServer(savepath);

        let img = new Image();
        img.imageId = server_res.public_id;
        img.src = server_res.secure_url;

        return img;
    }


    private uploadToServer(imgPath: string):Promise<any> {
        return new Promise((resolve, reject) => {
            cloudinary.uploader.upload(imgPath, (result)=>{ 
                this.logger.debug(`Image '${imgPath}' uploaded`);
                resolve(result);
            });
        });
    }

    async delete(id) {
        return new Promise((resolve, reject)=>{
            cloudinary.v2.api.delete_resources([id], (error, result)=> {
                if(!error) {
                    this.logger.debug(`Image '${id}' was deleted`);
                    resolve();
                } else {
                    this.logger.error(`Can't delete image. `+error);
                    reject(error);
                }
                
            });
        });
    }

    

    
}