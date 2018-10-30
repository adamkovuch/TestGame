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
Object.defineProperty(exports, "__esModule", { value: true });
var Gmail_1;
const logger_1 = require("../../core/logger");
const inversify_1 = require("inversify");
const nodemailer = require("nodemailer");
const setting_service_1 = require("../setting.service");
let Gmail = Gmail_1 = class Gmail {
    constructor(settings) {
        this.settings = settings;
        this.logger = logger_1.getLogger(Gmail_1);
        if (!process.env.GMAIL_LOGIN || !process.env.GMAIL_PASS) {
            this.logger.warn(`env vars GMAIL_LOGIN or GMAIL_PASS isn'n set. Mail may not work`);
        }
        this.transport = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: process.env.GMAIL_LOGIN,
                pass: process.env.GMAIL_PASS,
            },
        });
    }
    extractHostname(url) {
        var hostname;
        //find & remove protocol (http, ftp, etc.) and get hostname
        if (url.indexOf("//") > -1) {
            hostname = url.split('/')[2];
        }
        else {
            hostname = url.split('/')[0];
        }
        //find & remove port number
        hostname = hostname.split(':')[0];
        //find & remove "?"
        hostname = hostname.split('?')[0];
        return hostname;
    }
    async send(to, subject, body) {
        return new Promise(async (resolve, reject) => {
            await this.settings.load();
            let from = process.env.GMAIL_LOGIN;
            if (this.settings.get('site_url') && this.settings.get('site_url') !== '') {
                const hostname = this.extractHostname(this.settings.get('site_url'));
                from = `Admin <admin@${hostname}>`;
            }
            const mailOptions = {
                from: from,
                to,
                subject,
                html: body,
            };
            this.transport.sendMail(mailOptions, (error) => {
                if (error) {
                    this.logger.error(error);
                    reject(error);
                }
                else {
                    this.logger.info(`Email sent from '${from}'`);
                    resolve();
                }
            });
        });
    }
};
Gmail = Gmail_1 = __decorate([
    inversify_1.injectable(),
    __metadata("design:paramtypes", [setting_service_1.SettingService])
], Gmail);
exports.Gmail = Gmail;
//# sourceMappingURL=gmail.mail.js.map