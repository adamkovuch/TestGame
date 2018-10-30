import { Typegoose } from 'typegoose';
import { AdminUser } from '../models/admin.user';
import { Setting } from '../models/setting';
import { Content } from '../models/content';
import { Route } from '../models/route';

import * as mongoose from 'mongoose';

export function dbSeed(): Typegoose[] {
    const db = new Array<Typegoose>();

    //default admin user
    const adminUser = new AdminUser();
        adminUser.login = 'admin';
        adminUser.name = 'admin';
        adminUser.hash = '$2a$10$M3UOpY1BiyZMRHDOIvmtkOid816UUglAx4jzeQYdpExxmMt64vxh2';
        adminUser.salt = '$2a$10$M3UOpY1BiyZMRHDOIvmtkO';

    db.push(adminUser);


    let setting = new Setting(); setting.key = 'favicon'; setting.value = '';
    db.push(setting);

    setting = new Setting(); setting.key = 'site_name'; setting.value = 'VISITE';
    db.push(setting);

    setting = new Setting(); setting.key = 'site_description'; setting.value = '';
    db.push(setting);

    setting = new Setting(); setting.key = 'site_keywords'; setting.value = '';
    db.push(setting);

    setting = new Setting(); setting.key = 'site_url'; setting.value = '';
    db.push(setting);

    setting = new Setting(); setting.key = 'href_linkedin'; setting.value = 'https://www.linkedin.com/';
    db.push(setting);

    setting = new Setting(); setting.key = 'href_mailto'; setting.value = '';
    db.push(setting);


    setting = new Setting(); setting.key = '3d_rotate_auto'; setting.value = true;
    db.push(setting);

    setting = new Setting(); setting.key = '3d_rotate_speed'; setting.value = 10;
    db.push(setting);

    setting = new Setting(); setting.key = '3d_rotate_sensitivity'; setting.value = 0;
    db.push(setting);

    
    const defaultRoute = new Route(); 
    defaultRoute.alias = "home"; 
    defaultRoute.isDefault = true;
    defaultRoute.name = { _def: "Home" };
    defaultRoute.component = "welcome";
    (<any>defaultRoute)._id = mongoose.Types.ObjectId()
    db.push(defaultRoute);
    
    const defaultPage = new Content(); 
    defaultPage.title = { _def: "Home default page"}; 
    defaultPage.html = { _def: "<p>This is start page on your site...</p>"};
    defaultPage.route = (<any>defaultRoute)._id;
    db.push(defaultPage);
    
    return db;
}
