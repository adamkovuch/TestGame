import { Route } from '../core/models/route';
import { ContentController } from '../controllers/content.controller';
import { AdminUserController } from '../core/controllers/admin.user.controller';
import { TokenController } from '../core/controllers/token.controller';
import { SettingController } from '../core/controllers/setting.controller';
import { RouteController } from '../core/controllers/route.controller';
import { ImageController } from '../controllers/image.controller';
import { NotificationController } from '../core/controllers/notification.controller';
import { ButtonLinkController } from '../controllers/buttonlink.controller';
import { ContactsController } from '../controllers/contacts.controller';
import { PortfolioController } from '../controllers/portfolio.controller';
import { PortfolioContentController } from '../controllers/portfolio.content.controller';
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
        {path: '/route', controller: RouteController},
        {path: '/image', controller: ImageController},
        {path: '/notification', controller: NotificationController},
        /*************/

        /*Custom routes*/
        {path: '/content', controller: ContentController},
        {path: '/buttonlink', controller: ButtonLinkController},
        {path: '/contact', controller: ContactsController},
        {path: '/portfolio', controller: PortfolioController},
        {path: '/portfoliocontent', controller: PortfolioContentController}
        /**************/
    ];
}
