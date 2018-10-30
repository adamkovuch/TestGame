import { Route } from '../core/models/route';
import { AdminUserController } from '../core/controllers/admin.user.controller';
import { TokenController } from '../core/controllers/token.controller';
import { SettingController } from '../core/controllers/setting.controller';
import { ImageController } from '../controllers/image.controller';
import { NotificationController } from '../core/controllers/notification.controller';
import { FaviconController } from '../core/controllers/favicon.controller';
import { ManifestController } from '../core/controllers/manifest.controller';


export function getRoutes(): Route[] {
    return [
        /*Core routes*/
        {path: '/adminuser', controller: AdminUserController},
        {path: '/favicon', controller: FaviconController},
        {path: '/manifest', controller: ManifestController},
        {path: '/token', controller: TokenController},
        {path: '/setting', controller: SettingController},
        {path: '/image', controller: ImageController},
        {path: '/notification', controller: NotificationController},
        /*************/
    ];
}
