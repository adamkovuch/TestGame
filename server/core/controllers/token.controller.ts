import * as jwt from 'jsonwebtoken';
import { Request } from 'express';
import { Controller } from '../controller';
import { injectable, inject } from 'inversify';
import 'reflect-metadata';
import { AppError } from '../error.exception';
import { Repository } from '../repository/repository';
import { AdminUser } from '../../models/admin.user';
import * as bcrypt from 'bcryptjs';
import { RepositoryData } from '../repository/repository.data';


@injectable()
 export class TokenController implements Controller {

    private APP_SECRET: string;
    

    constructor(@inject(RepositoryData.of(AdminUser)) private adminUserRepository: Repository<AdminUser>) {
        
        this.APP_SECRET = process.env.APP_SECRET;
        if (!this.APP_SECRET) {
            this.APP_SECRET = 'DEF_SECRET';
        }
    }

    async get(req: Request, id?: any) {
        return await new Promise((resolve) => {
            const token = req.headers['x-access-token'];
            if (token) {

                jwt.verify(token, this.APP_SECRET, function(err, decoded) {
                    if (err) {
                        throw new AppError(400, 'Bad Request');
                    }
                    resolve(decoded);
                });
            }
            throw new AppError(400, 'Bad Request');
        });
    }
    async post(req: Request, id?: any) {
        if (req.body.login && req.body.password) {
            const res = await this.adminUserRepository.Get(e=>e.find({login: req.body.login}));
            if (res.length > 0) {
                const user = res[0];
                const passOk = await bcrypt.compare(req.body.password, user.hash);
                if (passOk) {
                    return this.getToken((<any>user)._id);
                }
            }
        }
        return null;
    }
    async put(req: Request, id?: any) {
        if(id) {
            return new Promise((resolve) => {
                jwt.verify(req.body.access_token, this.APP_SECRET, (err, decoded) => {
                    if (err) {
                        throw new AppError(400, 'Bad Request');
                    }
                    resolve(this.getToken(decoded.userid));
                });
            });
        }
        throw new AppError(400, 'Bad Request');
    }
    delete(req: Request, id?: any): Promise<any> {
        throw new AppError(404, 'Not Found');
    }

    private getToken(id: string) {
        const expiresIn = 86400;

        const key = jwt.sign({userid: id }, this.APP_SECRET, {
            expiresIn: expiresIn // expires in 24 hours
        });
        const d = new Date();
        d.setSeconds(d.getSeconds() + expiresIn);
        const token = {
            access_token: key,
            token_type: 'bearer',
            expires_in: d,
            userid: id
        };
        return token;
    }
}
