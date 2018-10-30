"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const bodyParser = require("body-parser");
const router_1 = require("./core/router");
const appRoot = require("app-root-path");
const path = require("path");
const fileUpload = require("express-fileupload");
const rendercache_1 = require("./core/rendercache");
const logger_1 = require("./core/logger");
const cors = require("cors");
const compression = require("compression");
class App {
    constructor() {
        this.log = logger_1.getLogger(App);
        process.setMaxListeners(0);
        this.app = express();
        this.router = new router_1.Router();
        this.cache = new rendercache_1.RenderCache();
        process.on('exit', this.cleanup);
    }
    async start() {
        await this.config();
        this.app.listen(global['server_port'], () => {
            this.log.info('Express server listening on port ' + global['server_port']);
        });
        if (this.log.level == 'debug') {
            setInterval(() => {
                const used = process.memoryUsage();
                this.log.debug(`--Memory usage--`);
                for (let key in used) {
                    this.log.debug(`${key} ${Math.round(used[key] / 1024 / 1024 * 100) / 100} MB`);
                }
            }, 60000);
        }
    }
    async config() {
        let compressionLevel = 0;
        if (parseInt(process.env.COMPRESSION) != NaN) {
            compressionLevel = parseInt(process.env.COMPRESSION);
        }
        this.app.use(compression({ filter: this.shouldCompress, level: compressionLevel }));
        this.app.use(cors());
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: false }));
        this.app.use(fileUpload({
            limits: { fileSize: 50 * 1024 * 1024 },
        }));
        this.app.get('/*', function (req, res, next) {
            if (req.headers.host.match(/^www/) !== null) {
                res.redirect('http://' + req.headers.host.replace(/^www\./, '') + req.url);
            }
            else {
                next();
            }
        });
        this.app.get('*/index.html', (req, res) => {
            res.sendFile(path.join(appRoot.path, 'dist/index.html'));
        });
        this.app.use(express.static(path.join(appRoot.path, 'dist'), { index: false }));
        this.app.use('/upload', express.static(path.join(appRoot.path, 'upload')));
        this.app.use('/api', await this.router.route());
        this.app.get('/clearcache', (req, res) => {
            const count = this.cache.clearCache();
            res.json({ status: "OK", count });
        });
        this.app.get('/logs', (req, res) => {
            try {
                const logger = new logger_1.Logger(App);
                if (req.query.file) {
                    logger.sendLog(req.query.file, res);
                }
                else {
                    res.json(logger.getLogs());
                }
            }
            catch (err) {
                this.log.error('Cannot get logs. ' + err);
            }
        });
        this.app.get('/', (req, res) => this.cache.render(req, res));
        this.app.get('*', (req, res) => this.cache.render(req, res));
    }
    cleanup() {
        this.router.cleanup();
    }
    shouldCompress(req, res) {
        if (req.headers['x-no-compression']) {
            return false;
        }
        return compression.filter(req, res);
    }
}
exports.default = new App();
//# sourceMappingURL=app.js.map