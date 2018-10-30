import { Mail } from "./mail";
import * as mailgun_builder from 'mailgun-js';
import { SettingService } from "../setting.service";
import { getLogger } from "../../core/logger";

export class Mailgun implements Mail {
    private logger = getLogger(Mailgun);

    private api_key = '';
    private domain = '';
    private service;

    constructor(private settings: SettingService) {
        this.api_key = 'key-'+process.env.MAILGUN_KEY;
        this.domain = process.env.MAILGUN_DOMAIN;
        if(!this.api_key || !this.domain) {
            this.logger.warn(`env vars MAILGUN_KEY or MAILGUN_DOMAIN isn'n set. Mailgun can't work`)
        }

        this.service = mailgun_builder({apiKey: this.api_key, domain: this.domain});
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
        return new Promise(async (resolve, reject)=>{
            await this.settings.load();

            let from = 'Admin <Admin@mailgun.org>'
            if(this.settings.get('site_url') && this.settings.get('site_url') !== '') {
                const hostname = this.extractHostname(this.settings.get('site_url'));
                from = `Admin <admin@${hostname}>`
            }
            const data = {
                from: from,
                to: to,
                subject: subject,
                html: body
            };

            this.service.messages().send(data, function (error, body) {
                if(error) {
                    reject(error);
                } else {
                    resolve();
                }
              });
        });
        
    }
}