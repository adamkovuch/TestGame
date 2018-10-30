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
require("reflect-metadata");
const security_1 = require("../core/security");
const error_exception_1 = require("../core/error.exception");
const admin_user_1 = require("../models/admin.user");
const recaptcha_1 = require("../helpers/recaptcha");
const notification_service_1 = require("../helpers/notification.service");
const repository_data_1 = require("../core/repository/repository.data");
const providers_1 = require("../config/providers");
let ContactsController = class ContactsController {
    constructor(mailsender, userRepository, reCaptcha, notificationService) {
        this.mailsender = mailsender;
        this.userRepository = userRepository;
        this.reCaptcha = reCaptcha;
        this.notificationService = notificationService;
    }
    async get(req) {
        throw new error_exception_1.AppError(404, 'Not found');
    }
    async post(req) {
        if (!req.body.captchaToken || !req.body.feedback ||
            !req.body.feedback.name || !req.body.feedback.email || !req.body.feedback.subject || !req.body.feedback.message) {
            throw new error_exception_1.AppError(400, 'Bad request');
        }
        const validToken = await this.reCaptcha.validateCaptcha(req.body.captchaToken);
        if (!validToken) {
            throw new error_exception_1.AppError(400, 'Invalid captcha token');
        }
        const userMails = (await this.userRepository.Get())
            .filter(elem => elem.email)
            .map(elem => elem.email);
        let text = `<div><b>Name:</b> <span>${req.body.feedback.name}</span></div>` +
            `<div><b>Email:</b> <span>${req.body.feedback.email}<span></div>` +
            `<div><b>Subject:</b> <span>${req.body.feedback.subject}<span></div>` +
            `<div><b>Message:</b> <p>${req.body.feedback.message}</p></div>`;
        this.notificationService.create('New feedback', text);
        text = `<h2>New feedback</h2>` + text;
        this.mailsender.send(userMails, 'New feedback', text);
    }
    put(id, req) {
        throw new error_exception_1.AppError(404, 'Not found.');
    }
    delete(id, req) {
        throw new error_exception_1.AppError(404, 'Not found.');
    }
};
__decorate([
    security_1.secure(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ContactsController.prototype, "get", null);
ContactsController = __decorate([
    inversify_1.injectable(),
    __param(0, inversify_1.inject(providers_1.MainProviders.mail)),
    __param(1, inversify_1.inject(repository_data_1.RepositoryData.of(admin_user_1.AdminUser))),
    __metadata("design:paramtypes", [Object, Object, recaptcha_1.ReCaptcha,
        notification_service_1.NotificationService])
], ContactsController);
exports.ContactsController = ContactsController;
//# sourceMappingURL=contacts.controller.js.map