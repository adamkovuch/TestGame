import { Typegoose } from 'typegoose';
import { AdminUser } from '../models/admin.user';
import { Setting } from '../models/setting';


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
    
    return db;
}
