import { Request } from 'express';
import { Controller } from '../core/controller';
import { injectable, inject } from 'inversify';
import 'reflect-metadata';
import { Repository } from '../core/repository/repository';
import { secure } from '../core/security';
import { AppError } from '../core/error.exception';
import { RepositoryLang } from '../core/repository/repository.lang';
import { ButtonLink } from '../models/buttonlink';
import { RepositoryObserver, ObserverEventType } from '../core/repository/repository.observer';
import { Route } from '../models/route';
import { getid } from '../extensions/getid';

@injectable()
 export class ButtonLinkController implements Controller, RepositoryObserver {
    

    constructor(@inject(RepositoryLang.of(ButtonLink)) private repository: Repository<ButtonLink>) {
    }

    async get(req: Request, id?: any) {
        if(id) {
            let res: ButtonLink;
            if(req.query.byroute && req.query.byroute === 'true') {
                const buttons = await this.repository.Get(e=> e.find({route: id}));
                if(buttons.length > 0) {
                    res = buttons[0];
                }
            } else {
                res = await this.repository.GetById(id);
            }
            if(res) {
                return res;
            }
        } else {
            const res = await this.repository.Get();
            return res;
        }
    }

    @secure()
    async post(req: Request, id?: any) {
        if(!req.body.buttonlink || !req.body.buttonlink.title || !req.body.buttonlink.link || !req.body.buttonlink.route) {
            throw new AppError(400, "Bad Request");
        }
        const data:ButtonLink = req.body.buttonlink;

        return await this.repository.Add(data);
    }
    
    @secure()
    async put(req: Request, id?: any) {
        if(!id || !req.body.buttonlink || !req.body.buttonlink._id) {
            throw new AppError(400, "Bad Request");
        }
        const data:ButtonLink = req.body.buttonlink;

        return await this.repository.Update(id, data);
    }

    @secure()
    async delete(req: Request, id?: any) {
        if(!id) {
            throw new AppError(400, "Bad Request");
        }
        await this.repository.Delete(id);
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