"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
const inversify_1 = require("inversify");
const appnotification_1 = require("../models/appnotification");
const repository_data_1 = require("../core/repository/repository.data");
let NotificationService = class NotificationService {
    constructor(repository) {
        this.repository = repository;
    }
    async getAll() {
        return await this.repository.Get();
    }
    async delete(id) {
        await this.repository.Delete(id);
    }
    async getUnreadCount() {
        const res = await this.repository.Get();
        return res.filter(elem => !elem.isRead).length;
    }
    async markAllAsRead() {
        const promises = new Array();
        const res = await this.repository.Get();
        res.filter(elem => !elem.isRead).forEach(elem => {
            elem.isRead = true;
            promises.push(this.repository.Update(elem._id, elem));
        });
        await Promise.all(promises);
    }
    async create(title, text) {
        const elem = new appnotification_1.AppNotification();
        elem.title = title;
        elem.text = text;
        await this.repository.Add(elem);
    }
};
NotificationService = __decorate([
    inversify_1.injectable(),
    __param(0, inversify_1.inject(repository_data_1.RepositoryData.of(appnotification_1.AppNotification))),
    __metadata("design:paramtypes", [Object])
], NotificationService);
exports.NotificationService = NotificationService;
//# sourceMappingURL=notification.service.js.map