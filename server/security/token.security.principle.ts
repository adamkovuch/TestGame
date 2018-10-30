import { SecurityPrinciple } from '../core/security';
import { Request } from 'express';
import { injectable } from 'inversify';
import 'reflect-metadata';
import * as jwt from 'jsonwebtoken';

@injectable()
export class TokenSecurityPrinciple implements SecurityPrinciple {
    async isAuthorized(req: Request) {
        return new Promise<boolean>((resolve) => {
            let token = req.headers['x-access-token'];
            if(token) {
                
                let APP_SECRET = process.env.APP_SECRET;
                if(!APP_SECRET)
                    APP_SECRET = 'DEF_SECRET';

                jwt.verify(token, APP_SECRET, function(err, decoded) {
                    if (err) {
                        resolve(false);
                    }
                    resolve(true);
                });
            } else {
                resolve(false);
            }
        });
    }
}
