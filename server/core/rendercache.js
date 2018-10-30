"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var RenderCache_1;
const inversify_1 = require("inversify");
const phantom = require("phantom");
const logger_1 = require("./logger");
const appRoot = require("app-root-path");
const path = require("path");
const fs = require("fs");
let RenderCache = RenderCache_1 = class RenderCache {
    constructor() {
        this.port = global['server_port'];
        this.log = logger_1.getLogger(RenderCache_1);
        this.root_dir = appRoot.path;
        this.dir_name = "render_cache";
        this.prerender_enable = true;
        this.loadPromises = [];
        if (process.env.PRERENDER) {
            this.prerender_enable = process.env.PRERENDER === 'false' ? false : true;
        }
        else {
            this.log.info(`Server started in SSR mode`);
        }
        this.prepareFolder();
        this.log.debug(`Cache folder ` + path.join(this.root_dir, this.dir_name));
    }
    async prepareFolder() {
        const p = path.join(this.root_dir, this.dir_name);
        if (!fs.existsSync(p)) {
            fs.mkdirSync(p);
        }
    }
    async render(req, res) {
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
        }
        else {
            res.sendFile(path.join(appRoot.path, 'dist/index.html'));
        }
    }
    clearCache() {
        let fileCount = 0;
        const files = fs.readdirSync(path.join(this.root_dir, this.dir_name));
        files.forEach(file => {
            fs.unlinkSync(path.join(this.root_dir, this.dir_name, file));
            fileCount++;
        });
        this.log.info(`Cache cleared. Deleted ${fileCount} files`);
        return fileCount;
    }
    async prerender(req) {
        if (this.loadPromises[req.path]) {
            this.log.debug(`Waiting for previous render`);
            return Promise.all([this.loadPromises[req.path]]);
        }
        const promise = new Promise(async (resolve) => {
            this.log.info(`Pre-render for ${req.path}`);
            const instance = await phantom.create([], {
                logLevel: 'error'
            });
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
                        return window.isPageLoaded();
                    });
                }
                await page.evaluate(function () {
                    window.toggleView();
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
                    }
                    catch (err) {
                        this.log.error(err);
                    }
                }, 500);
            });
            await page.open(fullUrl, { headers: { 'cache-control': 'no-cache' } });
        });
        this.loadPromises[req.path] = promise;
        return promise;
    }
    getFileNameFromUrl(url) {
        let filename = '_';
        if (url.length > 0) {
            filename = url.replace(new RegExp('/', 'g'), '_') + '.html';
        }
        return filename;
    }
};
RenderCache = RenderCache_1 = __decorate([
    inversify_1.injectable(),
    __metadata("design:paramtypes", [])
], RenderCache);
exports.RenderCache = RenderCache;
//# sourceMappingURL=rendercache.js.map