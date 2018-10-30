import { Request } from 'express';
import { Controller } from '../core/controller';
import { injectable, inject } from 'inversify';
import 'reflect-metadata';
import { Repository } from '../core/repository/repository';
import { secure } from '../core/security';
import { AppError } from '../core/error.exception';
import { RepositoryLang } from '../core/repository/repository.lang';
import { PortfolioItem } from '../models/portfolio.item';
import { Route } from '../models/route';
import { getid } from '../extensions/getid';
import { RepositoryObserver, ObserverEventType } from '../core/repository/repository.observer';

@injectable()
 export class PortfolioController implements Controller, RepositoryObserver {
    

    constructor(
        @inject(RepositoryLang.of(PortfolioItem)) private repository: Repository<PortfolioItem>, 
        @inject(RepositoryLang.of(Route)) private routerepository: Repository<Route>) {
    }

    async get(req: Request, id?: any) {
        if(id) {
            let res: PortfolioItem;
            if(req.query.byroute && req.query.byroute === 'true') {
                const contents = await this.repository.Get(e=> e.find({route: id}).populate('content'));
                if(contents.length > 0) {
                    res = contents[0];
                }
            } else if(req.query.byportfolioroute && req.query.byportfolioroute === 'true') {
                return await this.repository.Get(e=> e.find({portfolioRoute: id}));
            } else {
                res = await this.repository.GetById(id, elem=>elem.find().populate('content'));
            }
            if(!res) {
                throw new AppError(404, `id isn't found`);
            }
            return res;
        }
        return await this.repository.Get(e=>e.find().populate('-content'));
    }
    @secure()
    async post(req: Request, id?: any) {
        if(!req.body.portfolio || !req.body.portfolio.name || !req.body.portfolio.link || !req.body.portfolio.portfolioRoute) {
            throw new AppError(400, "Bad Request");
        }

        if(!req.body.portfolio.description) {
            req.body.portfolio.description = '';
        }
        const item: PortfolioItem = req.body.portfolio;

        if(!item.route) {
            const parentRoute = await this.routerepository.GetById(req.body.portfolio.portfolioRoute);
            if(!parentRoute) {
                throw new AppError(400, "Bad Request");
            }
    
            let route = new Route();
            route.name = item.name;
            route.visible = false;
            route.position = 1000;
            route.alias = parentRoute.alias + '/'+ item.link;
            route.component = 'portfolioitem';
            route = await this.routerepository.Add(route);
    
            item.route = getid(route);
        }
        
        return await this.repository.Add(item);
    }
    @secure()
    async put(req: Request, id?: any) {
        if(!req.body.portfolio || !id) {
            throw new AppError(400, "Bad Request");
        }

        const item: PortfolioItem = req.body.portfolio;

        return await this.repository.Update(id, item);
    }
    @secure()
    async delete(req: Request, id?: any) {
        if(!id) {
            throw new AppError(400, "Bad Request");
        }
        await this.deletePortfolio(id);
    }

    private async deletePortfolio(id:any) {
        const item = await this.repository.GetById(id);

        this.routerepository.Delete(item.route);

        await this.repository.Delete(id);
    }

    async onDataChanged(entity_type: any, entity: any, event: ObserverEventType) {
        if(entity_type === Route && event == ObserverEventType.Removed) {
            const route: Route = entity;
            let res = (await this.repository.Get(elem=>elem.find({portfolioRoute: route})));
            res.forEach(elem=>{
                this.deletePortfolio(getid(elem));
            });

            res = (await this.repository.Get(elem=>elem.find({route: route})));
            res.forEach(elem=>{
                this.deletePortfolio(getid(elem));
            });
        }
    }
}