import { Cloudinary } from "../helpers/image/cloudinary";
import { ReCaptcha } from "../helpers/recaptcha";
import { NotificationService } from "../helpers/notification.service";
import { Localization } from "../core/localization";
import { ImageEditor } from "../helpers/image.watermark";
import { SettingService } from "../helpers/setting.service";
import { Mailgun } from "../helpers/mail/mailgun.mail";
import { Type } from "../extensions/type";
import { Dependency } from "../core/models/dependency";
import { ImageProcess } from "../helpers/image.process";


export function provider(): Type<any>[] | Dependency[] {
    return [
        ImageProcess,
        { name: MainProviders.image, useClass: Cloudinary },
        { name: MainProviders.mail, useClass: Mailgun },
        ReCaptcha,
        NotificationService,
        Localization,
        ImageEditor,
        SettingService
    ];
}

export const MainProviders = {
    mail: 'mail',
    image: 'image'
}