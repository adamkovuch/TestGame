import { Request } from 'express';
import { Controller } from '../controller';
import { injectable, inject } from 'inversify';
import 'reflect-metadata';
import { Repository } from '../repository/repository';
import { secure } from '../security';
import { AppError } from '../error.exception';
import { Setting } from '../../models/setting';
import { RepositoryData } from '../repository/repository.data';
import { getid } from '../../extensions/getid';


@injectable()
 export class SettingController implements Controller {
    
    constructor(@inject(RepositoryData.of(Setting)) private repository: Repository<Setting>) {
    }

    async get(req: Request, id?: any) {
        if(id) {
            if(id === 'env' && req.query.key) {
                switch(req.query.key) {
                    case 'RECAPTCHA_SECRET_PUBLIC':
                        const s1 = new Setting();
                        s1.key = 'RECAPTCHA_SECRET_PUBLIC';
                        s1.value = process.env.RECAPTCHA_SECRET_PUBLIC
                        return s1;
                }
            }
            throw new AppError(404, 'Not Found');
        }
        return await this.repository.Get()
    }

    @secure()
    async post(req: Request, id?: any) {
        if(!req.body.settings || !req.body.settings.length) throw new AppError(400, 'Bad Request');

        const settings: Setting[] = req.body.settings;

        for(let i in settings) {
            const s = (await this.repository.Get(elem=>elem.find({ key: settings[i].key})))[0];
            if(s) {
                await this.repository.Update(getid(s), settings[i]);
            } else {
                await this.repository.Add(settings[i]);
            }
            
        }
        return settings;
        
    }
    async put(req: Request, id?: any) {
        throw new AppError(404, 'Not found.');
    }
    delete(req: Request, id?: any): Promise<any> {
        throw new AppError(404, 'Not found.');
    }
}
