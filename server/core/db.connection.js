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
var DbConnection_1;
const mongoose = require("mongoose");
const logger_1 = require("./logger");
class DbModels {
    static registerModel(modeltype) {
        this.logger.debug(`Registering model '${modeltype.name}'`);
        DbModels.modelTypes.push(modeltype);
        const model = new modeltype();
        model.getModelForClass(modeltype);
    }
}
DbModels.logger = logger_1.getLogger(DbModels);
DbModels.modelTypes = new Array();
exports.DbModels = DbModels;
const db_seed_1 = require("../config/db.seed");
const inversify_1 = require("inversify");
let DbConnection = DbConnection_1 = class DbConnection {
    constructor() {
        this.db_url = `mongodb://localhost:27017/visite`;
        this.isConnected = false;
        this.logger = logger_1.getLogger(DbConnection_1);
        this.ReconnectTimeout = 20000;
        this.timeoutInstance = null;
        if (process.env.MONGODB_URI) {
            this.db_url = process.env.MONGODB_URI;
        }
        mongoose.set('useCreateIndex', true);
    }
    getAllModelTypes() {
        return DbModels.modelTypes;
    }
    async connect() {
        try {
            this.logger.debug(`Mongoose is trying to connect to ${this.db_url}`);
            this.instance = await mongoose.connect(this.db_url, { useNewUrlParser: true });
            this.isConnected = true;
            this.logger.info(`Mongoose connected to ${this.db_url}`);
            await this.seedDb();
            if (this.timeoutInstance != null) {
                clearTimeout(this.timeoutInstance);
            }
        }
        catch (err) {
            this.logger.error(`Mongoose connection error: ${err}`);
            this.timeoutInstance = setTimeout(() => {
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
        const dbseeds = db_seed_1.dbSeed();
        const modelsNames = new Array();
        if (dbseeds.length == 0)
            return;
        const m = dbseeds[0].getModelForClass(dbseeds[0]);
        const res = await m.find();
        if (res.length > 0)
            return;
        this.logger.info('Seeding database');
        for (let i in dbseeds) {
            const name = dbseeds[i].getModelForClass(typeof dbseeds[i]).modelName;
            if (!modelsNames.find(elem => elem == name)) {
                modelsNames.push(name);
            }
        }
        for (let i in modelsNames) {
            this.logger.info(`Seeding for [${modelsNames[i]}]`);
            let models = dbseeds.filter(elem => elem.getModelForClass(elem).modelName == modelsNames[i]);
            for (let j in models) {
                const modelType = models[j].getModelForClass(typeof models[j]);
                const m = new modelType(models[j]);
                await m.save();
                this.logger.debug(`Model: [${JSON.stringify(models[j])}] added to [${modelsNames[i]}]`);
            }
        }
        this.logger.info('Db seeds completed');
    }
};
DbConnection = DbConnection_1 = __decorate([
    inversify_1.injectable(),
    __metadata("design:paramtypes", [])
], DbConnection);
exports.DbConnection = DbConnection;
//# sourceMappingURL=db.connection.js.map