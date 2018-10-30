import { Request } from 'express';
import { AppError } from './error.exception';
import { getLogger } from './logger';


export class Security {
    private logger = getLogger(Security);

    constructor(public securityPrinciple: SecurityPrinciple[]) {
    }

    public async checkSecurity(req: Request, func: Function) {
        this.logger.info(`Checking security for ${req.originalUrl}`);

        const elem = securetargets.find(elem => elem === func);

        if(elem) {
            for(let i in this.securityPrinciple) {
                this.logger.debug(`${req.originalUrl} checking security`);
                let isAuthorized = await this.securityPrinciple[i].isAuthorized(req)
                if(!isAuthorized) {
                    throw new AppError(403, 'Not authorized');
                }
            }
        } else {
            this.logger.info(`${req.originalUrl} isn't secure`);
        }
        this.logger.info(`Permission grant for ${req.originalUrl}`);
        return true;
    }
}

var securetargets = new Array();

export function secure() {
    return function (target: any, propertyKey: string, descriptor: TypedPropertyDescriptor<Function>) {
        securetargets.push(descriptor.value);
    };
}

export interface SecurityPrinciple {
    isAuthorized(req: Request): Promise<boolean>;
}
