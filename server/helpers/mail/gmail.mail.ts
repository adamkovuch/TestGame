import { getLogger } from '../../core/logger';
import { injectable } from 'inversify';
import * as nodemailer from 'nodemailer'
import { SettingService } from '../setting.service';
import { Mail } from './mail';

@injectable()
export class Gmail implements Mail {
    private logger = getLogger(Gmail);
    private transport: any;

    constructor(private settings: SettingService) {
        
        if(!process.env.GMAIL_LOGIN || !process.env.GMAIL_PASS){
            this.logger.warn(`env vars GMAIL_LOGIN or GMAIL_PASS isn'n set. Mail may not work`)
        }

        this.transport = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: process.env.GMAIL_LOGIN,
                pass: process.env.GMAIL_PASS,
            },
        });
    }

    private extractHostname(url) {
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

    async send(to: string[], subject: string, body: string) {
        return new Promise(async (resolve, reject) => {
            await this.settings.load();

            
            let from = process.env.GMAIL_LOGIN;
            if(this.settings.get('site_url') && this.settings.get('site_url') !== '') {
                const hostname = this.extractHostname(this.settings.get('site_url'));
                from = `Admin <admin@${hostname}>`
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
                } else {
                    this.logger.info(`Email sent from '${from}'`);
                    resolve();
                }
            });
        });

    }
}