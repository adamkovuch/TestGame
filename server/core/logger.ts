import * as winston from 'winston'
import * as appRoot from 'app-root-path';
import * as path from 'path';
import * as fs from 'fs';
import { Response } from 'express';

export class Logger {
  public logLevel: string;

  private log_dir =  path.join(appRoot.path, "logs");

  constructor(private classType) {
    if(!classType.name) throw new Error(`classType doesn't have name property`);
    this.logLevel = process.env.LOG_LEVEL;
    
    if (!this.logLevel) {
      if (process.env.NODE_ENV !== 'production') {
        this.logLevel = 'debug';
      } else {
        this.logLevel = 'error';
      }
    }

    const p = this.log_dir;
    if (!fs.existsSync(p)) {
      fs.mkdirSync(p);
    }
  }

  getLogs(): string[] {
    const res = fs.readdirSync(this.log_dir);
    return res;
  }

  sendLog(logname:string, res: Response) {
    if(fs.existsSync( path.join(this.log_dir, logname))) {
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
        maxsize: 5242880, // 5MB
        maxFiles: 5,
        colorize: false,
        format: winston.format.combine(
          winston.format.timestamp(),
          winston.format.align(),
          winston.format.printf(info => `${info.timestamp} [${info.level}] [${this.classType.name}]: ${info.message}`),
        )
      },
      console: {
        handleExceptions: true,
        json: false,
        colorize: true,
        format: winston.format.combine(
          winston.format.colorize(),
          winston.format.timestamp(),
          winston.format.align(),
          winston.format.printf(info => `${info.timestamp} [${info.level}] [${this.classType.name}]: ${info.message}`),
        )
      },
    };
    // instantiate a new Winston Logger with the settings defined above
    const logger = winston.createLogger({
      transports: [
        new winston.transports.File(options.file),
        new winston.transports.Console(options.console)
      ],
      level: this.logLevel,
      exitOnError: false, // do not exit on handled exceptions
    });
    return logger;
  }
}

export function getLogger(classType) {
  const logger = new Logger(classType);
  return logger.getLogger();
}
