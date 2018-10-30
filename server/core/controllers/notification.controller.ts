import { Controller } from "../controller";
import { injectable } from "inversify";
import { AppError } from "../error.exception";
import { secure } from "../security";
import { Request } from 'express';
import { NotificationService } from "../../helpers/notification.service";

@injectable()
 export class NotificationController implements Controller {
    constructor(private notificationService: NotificationService) {
    }

    @secure()
    async get(req: Request, id?: any) {
        if(req.query.type) {
            switch(req.query.type) {
                case 'asread':
                    await this.notificationService.markAllAsRead();
                    return null;
                case 'count':
                    return { count: (await this.notificationService.getAll()).length };
                case 'unread_count':
                    return {count: await this.notificationService.getUnreadCount() };
            }
        }
        else {
            const res = this.notificationService.getAll();
            return res;
        }
    }

    @secure()
    post(req: Request, id?: any): Promise<any> {
        throw new AppError(404, 'not found');
    }

    @secure()
    put(req: Request, id?: any): Promise<any> {
        throw new AppError(404, 'not found');
    }

    @secure()
    async delete(req: Request, id?: any) {
        await this.notificationService.delete(id);
    }
}