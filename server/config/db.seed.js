"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const admin_user_1 = require("../models/admin.user");
const setting_1 = require("../models/setting");
const content_1 = require("../models/content");
const route_1 = require("../models/route");
const mongoose = require("mongoose");
function dbSeed() {
    const db = new Array();
    //default admin user
    const adminUser = new admin_user_1.AdminUser();
    adminUser.login = 'admin';
    adminUser.name = 'admin';
    adminUser.hash = '$2a$10$M3UOpY1BiyZMRHDOIvmtkOid816UUglAx4jzeQYdpExxmMt64vxh2';
    adminUser.salt = '$2a$10$M3UOpY1BiyZMRHDOIvmtkO';
    db.push(adminUser);
    let setting = new setting_1.Setting();
    setting.key = 'favicon';
    setting.value = '';
    db.push(setting);
    setting = new setting_1.Setting();
    setting.key = 'site_name';
    setting.value = 'VISITE';
    db.push(setting);
    setting = new setting_1.Setting();
    setting.key = 'site_description';
    setting.value = '';
    db.push(setting);
    setting = new setting_1.Setting();
    setting.key = 'site_keywords';
    setting.value = '';
    db.push(setting);
    setting = new setting_1.Setting();
    setting.key = 'site_url';
    setting.value = '';
    db.push(setting);
    setting = new setting_1.Setting();
    setting.key = 'href_linkedin';
    setting.value = 'https://www.linkedin.com/';
    db.push(setting);
    setting = new setting_1.Setting();
    setting.key = 'href_mailto';
    setting.value = '';
    db.push(setting);
    setting = new setting_1.Setting();
    setting.key = '3d_rotate_auto';
    setting.value = true;
    db.push(setting);
    setting = new setting_1.Setting();
    setting.key = '3d_rotate_speed';
    setting.value = 10;
    db.push(setting);
    setting = new setting_1.Setting();
    setting.key = '3d_rotate_sensitivity';
    setting.value = 0;
    db.push(setting);
    const defaultRoute = new route_1.Route();
    defaultRoute.alias = "home";
    defaultRoute.isDefault = true;
    defaultRoute.name = { _def: "Home" };
    defaultRoute.component = "welcome";
    defaultRoute._id = mongoose.Types.ObjectId();
    db.push(defaultRoute);
    const defaultPage = new content_1.Content();
    defaultPage.title = { _def: "Home default page" };
    defaultPage.html = { _def: "<p>This is start page on your site...</p>" };
    defaultPage.route = defaultRoute._id;
    db.push(defaultPage);
    return db;
}
exports.dbSeed = dbSeed;
//# sourceMappingURL=db.seed.js.map