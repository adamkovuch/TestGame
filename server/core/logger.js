"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const winston = require("winston");
const appRoot = require("app-root-path");
const path = require("path");
const fs = require("fs");
class Logger {
    constructor(classType) {
        this.classType = classType;
        this.log_dir = path.join(appRoot.path, "logs");
        if (!classType.name)
            throw new Error(`classType doesn't have name property`);
        this.logLevel = process.env.LOG_LEVEL;
        if (!this.logLevel) {
            if (process.env.NODE_ENV !== 'production') {
                this.logLevel = 'debug';
            }
            else {
                this.logLevel = 'error';
            }
        }
        const p = this.log_dir;
        if (!fs.existsSync(p)) {
            fs.mkdirSync(p);
        }
    }
    getLogs() {
        const res = fs.readdirSync(this.log_dir);
        return res;
    }
    sendLog(logname, res) {
        if (fs.existsSync(path.join(this.log_dir, logname))) {
            res.download(path.join(this.log_dir, logname));
            return;
        }
        res.sendStatus(404);
    }
    getLogger() {
        const options = {
            file: {
                filename: path.join(this.log_dir, 'app.log'),
                handleExceptions: true,
                json: false,
                maxsize: 5242880,
                maxFiles: 5,
                colorize: false,
                format: winston.format.combine(winston.format.timestamp(), winston.format.align(), winston.format.printf(info => `${info.timestamp} [${info.level}] [${this.classType.name}]: ${info.message}`))
            },
            console: {
                handleExceptions: true,
                json: false,
                colorize: true,
                format: winston.format.combine(winston.format.colorize(), winston.format.timestamp(), winston.format.align(), winston.format.printf(info => `${info.timestamp} [${info.level}] [${this.classType.name}]: ${info.message}`))
            },
        };
        // instantiate a new Winston Logger with the settings defined above
        const logger = winston.createLogger({
            transports: [
                new winston.transports.File(options.file),
                new winston.transports.Console(options.console)
            ],
            level: this.logLevel,
            exitOnError: false,
        });
        return logger;
    }
}
exports.Logger = Logger;
function getLogger(classType) {
    const logger = new Logger(classType);
    return logger.getLogger();
}
exports.getLogger = getLogger;
//# sourceMappingURL=logger.js.map