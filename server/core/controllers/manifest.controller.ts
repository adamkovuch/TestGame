import { injectable } from "inversify";
import { Request } from 'express';

import { Controller } from "../controller";

import { SettingService } from "../../helpers/setting.service";

import { secure } from "../security";

import { AppError } from "../error.exception";
import { Manifest } from "../../models/manifest";

@injectable()
export class ManifestController implements Controller {
    constructor(
        private setting: SettingService) {
    }

    async get(req: Request, id?: any) {
        await this.setting.load();
        const manifest: Manifest = {
            name: this.setting.get('site_name'),
            short_name: this.setting.get('site_name'),
            display: "standalone",
            description: this.setting.get('site_description'),
            scope: '/',
            splash_pages: null,
            start_url: '/',
            icons: [
                { type: "image/png", sizes: "72x72", src: "/api/favicon?size=72x72" },
                { type: "image/png", sizes: "96x96", src: "/api/favicon?size=96x96" },
                { type: "image/png", sizes: "128x128", src: "/api/favicon?size=128x128" },
                { type: "image/png", sizes: "144x144", src: "/api/favicon?size=144x144" },
                { type: "image/png", sizes: "152x152", src: "/api/favicon?size=152x152" },
                { type: "image/png", sizes: "192x192", src: "/api/favicon?size=192x192" },
                { type: "image/png", sizes: "384x384", src: "/api/favicon?size=384x384" },
                { type: "image/png", sizes: "512x512", src: "/api/favicon?size=512x512" }
            ]
        };
        return manifest;
    }

    @secure()
    async post(req: Request, id?: any) {
        throw new AppError(404, 'Not Found');
    }

    @secure()
    async put(req: Request, id?: any) {
        throw new AppError(404, 'Not Found');
    }

    @secure()
    async delete(req: Request, id?: any) {
        throw new AppError(404, 'Not Found');
    }
}