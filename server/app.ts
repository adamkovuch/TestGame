import * as express from 'express';
import * as bodyParser from 'body-parser';
import { Router } from './core/router';
import * as appRoot from 'app-root-path';
import * as path from 'path';
import * as fileUpload from 'express-fileupload';
import { getLogger, Logger } from './core/logger';
import * as cors from 'cors';
import * as compression from 'compression';

class App {
    public app: express.Application;
    public router: Router;

    public dist_folder = "game-dist/game";

    private log = getLogger(App);

    constructor() {
        process.setMaxListeners(0);

        this.app = express();
        this.router = new Router();
        process.on('exit', this.cleanup);
    }

    async start() {
        await this.config();
        
        this.app.listen(global['server_port'], ()=> {
            this.log.info('Express server listening on port ' + global['server_port']);
        });

        if(this.log.level == 'debug') {
            setInterval(()=> {
                const used = process.memoryUsage();
                this.log.debug(`--Memory usage--`);
                for (let key in used) {
                    this.log.debug(`${key} ${Math.round(used[key] / 1024 / 1024 * 100) / 100} MB`);
                }
            }, 60000)
        } 
    }

    async config() {
        let compressionLevel = 0;
        if(parseInt(process.env.COMPRESSION) != NaN) {
            compressionLevel = parseInt(process.env.COMPRESSION);
        }
        this.app.use(compression({filter: this.shouldCompress, level: compressionLevel }));

        this.app.use(cors());
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: false }));
        

        this.app.use(fileUpload({
            limits: { fileSize: 50 * 1024 * 1024 },
        }));

        this.app.get('/*', function(req, res, next) {
            if (req.headers.host.match(/^www/) !== null ) {
              res.redirect('http://' + req.headers.host.replace(/^www\./, '') + req.url);
            } else {
              next();     
            }
        });

        this.app.use(express.static(path.join(appRoot.path, this.dist_folder), { index: false }));
        this.app.use('/upload', express.static(path.join(appRoot.path, 'upload')));

        this.app.use('/api', await this.router.route());

        this.app.get('/logs', (req, res) => {
            try {
                const logger = new Logger(App);
                if (req.query.file) {
                    logger.sendLog(req.query.file, res);
                } else {
                    res.json(logger.getLogs());
                }
            } catch (err) {
                this.log.error('Cannot get logs. ' + err);
            }
        });

        this.app.get('*', (req, res)=>res.sendFile(path.join(appRoot.path, this.dist_folder, 'index.html')));
    }

    private cleanup() {
        this.router.cleanup();
    }

    private shouldCompress (req, res) {
        if (req.headers['x-no-compression']) {
            return false
        }
    
        return compression.filter(req, res)
    }
}

export default new App();
