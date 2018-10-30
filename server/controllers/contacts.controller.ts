import { Request } from 'express';
import { Controller } from '../core/controller';
import { injectable, inject } from 'inversify';
import 'reflect-metadata';
import { secure } from '../core/security';
import { AppError } from '../core/error.exception';
import { AdminUser } from '../models/admin.user';
import { ReCaptcha } from '../helpers/recaptcha';
import { NotificationService } from '../helpers/notification.service';
import { Repository } from '../core/repository/repository';
import { RepositoryData } from '../core/repository/repository.data';
import { Mail } from '../helpers/mail/mail';
import { MainProviders } from '../config/providers';

@injectable()
 export class ContactsController implements Controller {
    constructor(
        @inject(MainProviders.mail) private mailsender: Mail,
        @inject(RepositoryData.of(AdminUser)) private userRepository: Repository<AdminUser>,
        private reCaptcha: ReCaptcha,
        private notificationService: NotificationService) {
    }

    @secure()
    async get(req: Request) {
        throw new AppError(404, 'Not found');
    }

    async post(req: Request) {
        if(!req.body.captchaToken || !req.body.feedback || 
            !req.body.feedback.name || !req.body.feedback.email || !req.body.feedback.subject || !req.body.feedback.message) {
            throw new AppError(400, 'Bad request');
        }

        const validToken = await this.reCaptcha.validateCaptcha(req.body.captchaToken);
        if(!validToken) {
            throw new AppError(400, 'Invalid captcha token');
        }

        const userMails = (await this.userRepository.Get())
            .filter(elem=>elem.email)
            .map(elem=>elem.email);

        let text =  `<div><b>Name:</b> <span>${req.body.feedback.name}</span></div>`+
                    `<div><b>Email:</b> <span>${req.body.feedback.email}<span></div>` +
                    `<div><b>Subject:</b> <span>${req.body.feedback.subject}<span></div>` +
                    `<div><b>Message:</b> <p>${req.body.feedback.message}</p></div>`;

        this.notificationService.create('New feedback', text);

        text = `<h2>New feedback</h2>`+text;

        this.mailsender.send(userMails, 'New feedback', text);
    }
    put(id: any, req: Request): Promise<any> {
        throw new AppError(404, 'Not found.');
    }
    delete(id: any, req: Request): Promise<any> {
        throw new AppError(404, 'Not found.');
    }

    
}