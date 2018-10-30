import { injectable, inject } from "inversify";
import { Repository } from "../core/repository/repository";
import { AppNotification } from "../models/appnotification";
import { RepositoryData } from "../core/repository/repository.data";

@injectable()
export class NotificationService {
    constructor(@inject(RepositoryData.of(AppNotification)) private repository: Repository<AppNotification>) {
    }

    async getAll() {
        return await this.repository.Get();
    }

    async delete(id: string) {
        await this.repository.Delete(id);
    }

    async getUnreadCount() {
        const res = await this.repository.Get();
        return res.filter(elem => !elem.isRead).length;
    }

    async markAllAsRead() {
        const promises: Promise<any>[] = new Array();
        const res = await this.repository.Get();
        res.filter(elem => !elem.isRead).forEach(elem => {
            elem.isRead = true;
            promises.push(this.repository.Update((<any>elem)._id, elem));
        });

        await Promise.all(promises);
    }

    async create(title: string, text: string) {
        const elem = new AppNotification();
        elem.title = title;
        elem.text = text;
        await this.repository.Add(elem);
    }
}