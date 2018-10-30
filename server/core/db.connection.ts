
import * as mongoose from 'mongoose';
import { getLogger } from './logger';

export class DbModels {
    private static logger = getLogger(DbModels);
    public static registerModel(modeltype) {
        this.logger.debug(`Registering model '${modeltype.name}'`)
        DbModels.modelTypes.push(modeltype);
        const model: Typegoose = new modeltype();
        model.getModelForClass(modeltype);
        
    }

    static readonly modelTypes = new Array(); 
}

import { dbSeed } from '../config/db.seed';
import { injectable } from 'inversify'
import { Typegoose } from 'typegoose'

@injectable()
export class DbConnection {
    private db_url = `mongodb://localhost:27017/visite`;
    instance: typeof mongoose;
    isConnected = false;
    private logger = getLogger(DbConnection);
    private readonly ReconnectTimeout = 20000;

    constructor() {
        if (process.env.MONGODB_URI) {
            this.db_url = process.env.MONGODB_URI;
        }
        mongoose.set('useCreateIndex', true);
    }

    getAllModelTypes() {
        return DbModels.modelTypes;
    }

    private timeoutInstance = null;

    async connect() {
        try {
            this.logger.debug(`Mongoose is trying to connect to ${this.db_url}`);
            this.instance = await mongoose.connect(this.db_url, { useNewUrlParser: true });
            this.isConnected = true;
            this.logger.info(`Mongoose connected to ${this.db_url}`);
            await this.seedDb();
            if(this.timeoutInstance != null){
                clearTimeout(this.timeoutInstance);
            }
        } catch (err) {
            this.logger.error(`Mongoose connection error: ${err}`);
            this.timeoutInstance = setTimeout(()=>{
                this.connect();
            }, this.ReconnectTimeout);
        }
    }

    async disconnect() {
        if (this.instance) {
            this.instance.disconnect();
            this.logger.info(`Mongoose disconnected from ${this.db_url}`);
        }
    }

    async seedDb() {
        const dbseeds = dbSeed();
        const modelsNames = new Array();
        if(dbseeds.length == 0) return;
        const m = dbseeds[0].getModelForClass(dbseeds[0]);
        
        const res = await m.find();
        if(res.length > 0) return;

        this.logger.info('Seeding database');
        for (let i in dbseeds) {
            const name = dbseeds[i].getModelForClass(typeof dbseeds[i]).modelName;
            if(!modelsNames.find(elem => elem == name)) {
                modelsNames.push(name);
            }
        }

        for(let i in modelsNames) {
            this.logger.info(`Seeding for [${modelsNames[i]}]`);

            let models = dbseeds.filter(elem => elem.getModelForClass(elem).modelName == modelsNames[i]);
            for(let j in models) {
                const modelType = models[j].getModelForClass(typeof models[j]);

                const m = new modelType(models[j]);
                await m.save();
                this.logger.debug(`Model: [${JSON.stringify(models[j])}] added to [${modelsNames[i]}]`);
            }
        }

        this.logger.info('Db seeds completed');
    }
}