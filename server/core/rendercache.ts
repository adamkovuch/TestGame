import { injectable } from "inversify";
import * as phantom from 'phantom';
import { Request, Response } from 'express';
import { getLogger } from "./logger";
import * as appRoot from 'app-root-path';
import * as path from 'path';
import * as fs from 'fs';

@injectable()
export class RenderCache {
    private port = global['server_port'];
    private log = getLogger(RenderCache);
    private root_dir = appRoot.path;
    private dir_name = "render_cache";

    public prerender_enable = true;

    private readonly loadPromises: Promise<void>[] = [];

    constructor() {
        if (process.env.PRERENDER) {
            this.prerender_enable = process.env.PRERENDER === 'false' ? false : true;
        } else {
            this.log.info(`Server started in SSR mode`);
        }
        this.prepareFolder();
        this.log.debug(`Cache folder ` + path.join(this.root_dir, this.dir_name));
    }

    private async prepareFolder() {
        const p = path.join(this.root_dir, this.dir_name);

        if (!fs.existsSync(p)) {
            fs.mkdirSync(p);
        }
    }

    public async render(req: Request, res: Response) {
        if (this.prerender_enable && req.headers["cache-control"] !== 'no-cache') {
            const filename = this.getFileNameFromUrl(req.path);
            const ph = path.join(this.root_dir, this.dir_name, filename);
            if (fs.existsSync(ph)) {
                const file = fs.readFileSync(ph);
                res.send(file.toString());
                this.prerender(req);
                return;
            }
            await this.prerender(req);
            res.sendFile(ph);
        } else {
            res.sendFile(path.join(appRoot.path, 'dist/index.html'));
        }
    }

    public clearCache() {
        let fileCount = 0;
        const files = fs.readdirSync(path.join(this.root_dir, this.dir_name));
        files.forEach(file => {
            fs.unlinkSync(path.join(this.root_dir, this.dir_name, file));
            fileCount++
        });
        this.log.info(`Cache cleared. Deleted ${fileCount} files`);
        return fileCount;
    }

    public async prerender(req: Request) {
        if (this.loadPromises[req.path]) {
            this.log.debug(`Waiting for previous render`);
            return Promise.all([this.loadPromises[req.path]]);
        }
        const promise = new Promise(async (resolve) => {
            this.log.info(`Pre-render for ${req.path}`);
            const instance = await phantom.create([], {
                logLevel: 'error'
            })
            const page = await instance.createPage();
            await page.on('onResourceRequested', (requestData) => {
                this.log.debug(`Requesting ${requestData.url}`);
            });

            let url = req.path.slice(1);
            if (url.length > 0) {
                url = '/' + url;
            }
            const fullUrl = `http://localhost:${this.port}${url}/index.html`;

            await page.on('onLoadFinished', async () => {
                const filename = this.getFileNameFromUrl(req.path);
                
                let isPageLoaded = false;
                while (!isPageLoaded) {
                    isPageLoaded = await page.evaluate(function () {
                        return (<any>window).isPageLoaded();
                    });
                }

                await page.evaluate(function () {
                    (<any>window).toggleView();
                });

                setTimeout(async () => {
                    try {
                        const content = await page.property('content');
                        fs.writeFileSync(path.join(this.root_dir, this.dir_name, filename), content);
                        this.log.info(`${req.path} is pre-rendered`);

                        delete this.loadPromises[req.path];
                        resolve();
                        page.close();
                        instance.exit();
                    } catch(err) {
                        this.log.error(err);
                    }
                    
                }, 500);
            })

            await page.open(fullUrl, { headers: { 'cache-control': 'no-cache' } });
        });
        this.loadPromises[req.path] = promise;

        return promise;
    }

    private getFileNameFromUrl(url: string): string {
        let filename = '_';
        if (url.length > 0) {
            filename = url.replace(new RegExp('/', 'g'), '_') + '.html';
        }
        return filename;
    }
}