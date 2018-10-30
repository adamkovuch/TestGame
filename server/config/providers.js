"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cloudinary_1 = require("../helpers/image/cloudinary");
const recaptcha_1 = require("../helpers/recaptcha");
const notification_service_1 = require("../helpers/notification.service");
const localization_1 = require("../core/localization");
const image_watermark_1 = require("../helpers/image.watermark");
const setting_service_1 = require("../helpers/setting.service");
const mailgun_mail_1 = require("../helpers/mail/mailgun.mail");
const image_process_1 = require("../helpers/image.process");
function provider() {
    return [
        image_process_1.ImageProcess,
        { name: exports.MainProviders.image, useClass: cloudinary_1.Cloudinary },
        { name: exports.MainProviders.mail, useClass: mailgun_mail_1.Mailgun },
        recaptcha_1.ReCaptcha,
        notification_service_1.NotificationService,
        localization_1.Localization,
        image_watermark_1.ImageEditor,
        setting_service_1.SettingService
    ];
}
exports.provider = provider;
exports.MainProviders = {
    mail: 'mail',
    image: 'image'
};
//# sourceMappingURL=providers.js.map