import * as got from 'got';
import { getLogger } from '../core/logger';
import { injectable } from 'inversify';

@injectable()
export class ReCaptcha {

    secret_key= '';
    private logger = getLogger(ReCaptcha);

    constructor() {
        if(!process.env.RECAPTCHA_SECRET_PRIVATE) {
            this.logger.warn(`recaptcha_secret isn't set. ReCaptcha may not work`)
        }
    }

    async validateCaptcha(token: string) {
        this.logger.debug('Validating captcha token');
        const res = await got.post('https://www.google.com/recaptcha/api/siteverify', {
            json: true,
            query: {
                secret: process.env.RECAPTCHA_SECRET_PRIVATE,
                response: token
            }
        })
        if(res.body.success) return true;

        return false;
    }
}