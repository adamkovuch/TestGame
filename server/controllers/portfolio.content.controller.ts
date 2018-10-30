import { Request } from 'express';
import { Controller } from '../core/controller';
import { injectable, inject } from 'inversify';
import 'reflect-metadata';
import { Repository } from '../core/repository/repository';
import { secure } from '../core/security';
import { AppError } from '../core/error.exception';
import { RepositoryLang } from '../core/repository/repository.lang';
import { PortfolioItem } from '../models/portfolio.item';
import { PortfolioContent } from '../models/portfolio.content';
import { ObserverEventType, RepositoryObserver } from '../core/repository/repository.observer';
import { ImageProcess } from '../helpers/image.process';

@injectable()
 export class PortfolioContentController implements Controller, RepositoryObserver {

    constructor(
        @inject(RepositoryLang.of(PortfolioContent)) private repository: Repository<PortfolioContent>) {
    }

    async get(req: Request, id?: any) {
        if(id) {
            const res = await this.repository.GetById(id);
            if(res) {
                return res;
            }
        }

        throw new AppError(404, "Not found");
    }
    @secure()
    async post(req: Request, id?: any) {
        if(!req.body.content) {
            throw new AppError(400, "Bad Request");
        }

        const content: PortfolioContent = req.body.content;

        return await this.repository.Add(content);
    }
    @secure()
    async put(req: Request, id?: any) {
        if(!req.body.content || !id) {
            throw new AppError(400, "Bad Request");
        }

        const content: PortfolioContent = req.body.content;

        return await this.repository.Update(id, content);
    }
    @secure()
    async delete(req: Request, id?: any) {
        if(!id) {
            throw new AppError(400, "Bad Request");
        }
        await this.repository.Delete(id);
    }

    async onDataChanged(entity_type: any, entity: any, event: ObserverEventType) {
        if(entity_type === PortfolioItem && event == ObserverEventType.Removed) {
            const portfolioItem: PortfolioItem = entity;
            portfolioItem.content.forEach(elem=>{
                this.repository.Delete(elem);
            });
        }
    }
}