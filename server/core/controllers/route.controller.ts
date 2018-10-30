import { Request, Response } from 'express';
import { Controller } from '../controller';
import { injectable, inject } from 'inversify';
import 'reflect-metadata';
import { Repository } from '../repository/repository';
import { secure } from '../security';
import { AppError } from '../error.exception';
import { Route } from '../../models/route';
import { Content } from '../../models/content';
import { RepositoryLang } from '../repository/repository.lang';
import { getid } from '../../extensions/getid';
import { PortfolioItem } from '../../models/portfolio.item';
import { ObserverEventType } from '../repository/repository.observer';


@injectable()
 export class RouteController implements Controller {
     
    constructor(
        @inject(RepositoryLang.of(Route)) private repository: Repository<Route>,
        @inject(RepositoryLang.of(Content)) private contentRepository: Repository<Content>) {
    }

    async get(req: Request, id?: any) {
        if(id) {
            const res = await this.repository.GetById(id);
            if(!res) {
                throw new AppError(404, `id isn't found`);
            }
            return res;
        }
        const res = await this.repository.Get();
        return res;
    }

    @secure()
    async post(req: Request, id?: any) {
        if(!req.body.route) {
            throw new AppError(400, "Bad Request");
        }
        let c:Route = req.body.route;
        if(c.isDefault) {
            await this.removeAllDefaultRoute();
        }
        c = await this.repository.Add(c);

        const content = new Content();
        content.html = "<p>Hello world<p>";
        content.title = c.name;
        content.route = (<any>c)._id;
        await this.contentRepository.Add(content);
        
        return c;
    }
    @secure()
    async put(req: Request, id?: any) {
        if(!req.body.route || !req.body.route._id) {
            throw new AppError(400, "Bad Request");
        }
        const c:Route = req.body.route;
        if(c.isDefault) {
            await this.removeAllDefaultRoute();
        }
        return await this.repository.Update(id, c);
    }
    @secure()
    async delete(req: Request, id?: any) {
        return await this.repository.Delete(id);
    }

    private async removeAllDefaultRoute() {
        const res = await this.repository.Get(e=>e.find({ isDefault: true }));
        res.forEach(elem=>{
            elem.isDefault = false;
            this.repository.Update(getid(elem), elem);
        });
    }

    async onDataChanged(entity_type: any, entity: any, event: ObserverEventType) {
        if(entity_type === PortfolioItem && event == ObserverEventType.Modified) {
            const portfolioItem: PortfolioItem = entity;
            const route = await this.repository.GetById(portfolioItem.route);
            if(route.name !== portfolioItem.name) {
                route.name = portfolioItem.name;
                this.repository.Update(portfolioItem.route, route);
            }
        }
    }
}
