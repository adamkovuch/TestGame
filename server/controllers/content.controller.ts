import { Request } from 'express';
import { Controller } from '../core/controller';
import { injectable, inject } from 'inversify';
import 'reflect-metadata';
import { Repository } from '../core/repository/repository';
import { secure } from '../core/security';
import { Content } from '../models/content';
import { AppError } from '../core/error.exception';
import { RepositoryLang } from '../core/repository/repository.lang';
import { RepositoryObserver, ObserverEventType } from '../core/repository/repository.observer';
import { Route } from '../models/route';
import { getid } from '../extensions/getid';

@injectable()
 export class ContentController implements Controller, RepositoryObserver {
    
    constructor(@inject(RepositoryLang.of(Content)) private repository: Repository<Content>) {
    }

    async get(req: Request, id?: any) {
        if(id) {
            let res: Content;
            if(req.query.byroute && req.query.byroute === 'true') {
                const contents = await this.repository.Get(e=> e.find({route: id}));
                if(contents.length > 0) {
                    res = contents[0];
                }
            } else {
                res = await this.repository.GetById(id);
            }
            if(!res) {
                throw new AppError(404, `id isn't found`);
            }
            return res;
        }

        const res = await this.repository.Get(e=>e.find().populate('route'));
        return res;
    }
    post(req: Request, id?: any): Promise<any> {
        throw new AppError(404, `Not Found`);
    }
    @secure()
    async put(req: Request, id?: any) {
        if(!req.body.content || !req.body.content._id) {
            throw new AppError(400, "Bad Request");
        }
        const c:Content = req.body.content;

        return await this.repository.Update(req.body.content._id, c);
    }
    delete(req: Request, id?: any): Promise<any> {
        throw new AppError(404, `Not Found`);
    }

    async onDataChanged(entity_type: any, entity: any, event: ObserverEventType) {
        if(entity_type === Route && event == ObserverEventType.Removed) {
            const route: Route = entity;
            const res = (await this.repository.Get(elem=>elem.find({route: route})))[0];
            if(res) {
                this.repository.Delete(getid(res));
            }
        }
    }
}