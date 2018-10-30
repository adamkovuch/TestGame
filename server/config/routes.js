"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const content_controller_1 = require("../controllers/content.controller");
const admin_user_controller_1 = require("../core/controllers/admin.user.controller");
const token_controller_1 = require("../core/controllers/token.controller");
const setting_controller_1 = require("../core/controllers/setting.controller");
const route_controller_1 = require("../core/controllers/route.controller");
const image_controller_1 = require("../controllers/image.controller");
const notification_controller_1 = require("../core/controllers/notification.controller");
const buttonlink_controller_1 = require("../controllers/buttonlink.controller");
const contacts_controller_1 = require("../controllers/contacts.controller");
const portfolio_controller_1 = require("../controllers/portfolio.controller");
const portfolio_content_controller_1 = require("../controllers/portfolio.content.controller");
const favicon_controller_1 = require("../core/controllers/favicon.controller");
const manifest_controller_1 = require("../core/controllers/manifest.controller");
function getRoutes() {
    return [
        /*Core routes*/
        { path: '/adminuser', controller: admin_user_controller_1.AdminUserController },
        { path: '/favicon', controller: favicon_controller_1.FaviconController },
        { path: '/manifest', controller: manifest_controller_1.ManifestController },
        { path: '/token', controller: token_controller_1.TokenController },
        { path: '/setting', controller: setting_controller_1.SettingController },
        { path: '/route', controller: route_controller_1.RouteController },
        { path: '/image', controller: image_controller_1.ImageController },
        { path: '/notification', controller: notification_controller_1.NotificationController },
        /*************/
        /*Custom routes*/
        { path: '/content', controller: content_controller_1.ContentController },
        { path: '/buttonlink', controller: buttonlink_controller_1.ButtonLinkController },
        { path: '/contact', controller: contacts_controller_1.ContactsController },
        { path: '/portfolio', controller: portfolio_controller_1.PortfolioController },
        { path: '/portfoliocontent', controller: portfolio_content_controller_1.PortfolioContentController }
        /**************/
    ];
}
exports.getRoutes = getRoutes;
//# sourceMappingURL=routes.js.map