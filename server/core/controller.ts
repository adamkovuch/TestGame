import { Request } from 'express';

export interface Controller {
    get(req: Request, id?: any): Promise<any>;
    post(req: Request, id?: any): Promise<any>;
    put(req: Request, id?: any): Promise<any>;
    delete(req: Request, id?: any): Promise<any>;
}
