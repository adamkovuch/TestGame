import { Request } from 'express';
import { Controller } from '../controller';
import { injectable, inject } from 'inversify';
import 'reflect-metadata';
import { Repository } from '../repository/repository';
import { AdminUser } from '../../models/admin.user';
import { AppError } from '../error.exception';
import { secure } from '../security';
import * as bcrypt from 'bcryptjs';
import { RepositoryData } from '../repository/repository.data';


@injectable()
 export class AdminUserController implements Controller {
    
    constructor(@inject(RepositoryData.of(AdminUser)) private repository: Repository<AdminUser>) {
    }

    async get(req: Request, id?: any) {
        if(id) {
            const res = await this.repository.GetById(id);
            if (res) {
                return res;
            }
        } else {
            const res = await this.repository.Get();
            if (res) {
                return res;
            }
        }
        throw new AppError(404, 'not found');
    }

    @secure()
    async post(req: Request) {
        const entity = new AdminUser();
        if (req.body.user.name &&
            req.body.user.login &&
            req.body.user.password) {

            if (req.body.user.email) {
                entity.email = req.body.user.email;
            }

            entity.login = req.body.user.login;
            entity.name = req.body.user.name;

            entity.salt = await bcrypt.genSalt(10);
            entity.hash = await bcrypt.hash(req.body.user.password, entity.salt);

            try {
                return await this.repository.Add(entity);
            } catch (err) {
                throw new AppError(400, 'Bad request');
            }
        } else {
            throw new AppError(400, 'Bad request');
        }
    }

    @secure()
    async put(req: Request, id: any) {
        const entity = new AdminUser();
        if (req.body.user.name &&
            req.body.user.login &&
            req.body.user._id) {

            if (req.body.user.email) {
                entity.email = req.body.user.email;
            }

            entity.login = req.body.user.login;
            entity.name = req.body.user.name;

            if(req.body.user.password) {
                entity.salt = await bcrypt.genSalt(10);
                entity.hash = await bcrypt.hash(req.body.user.password, entity.salt);
            } else {
                delete entity.salt;
                delete entity.hash;
            }
            try {
                return await this.repository.Update(id, entity);
            } catch (err) {
                throw new AppError(400, 'Bad request');
            }
        } else {
            throw new AppError(400, 'Bad request');
        } 
    }

    @secure()
    async delete(req: Request, id: any): Promise<any> {
       return await this.repository.Delete(id);
    }
}
