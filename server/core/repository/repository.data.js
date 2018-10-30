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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
var RepositoryData_1;
const mongoose = require("mongoose");
const inversify_1 = require("inversify");
const repository_observer_1 = require("./repository.observer");
const logger_1 = require("../logger");
const getid_1 = require("../../extensions/getid");
let RepositoryData = RepositoryData_1 = class RepositoryData {
    constructor(entityType) {
        this.entityType = entityType;
        this.logger = logger_1.getLogger(RepositoryData_1);
        this.entity = this.create(entityType);
    }
    static of(modelType) {
        if (modelType.name) {
            return 'rep_' + modelType.name;
        }
        return 'rep_' + modelType;
    }
    async Get(expression) {
        let res;
        if (expression) {
            res = (await expression(this.entity.getModelForClass(this.entityType)));
        }
        else {
            res = await this.entity.getModelForClass(this.entityType).find();
        }
        for (let i in res) {
            res[i] = res[i].toObject();
        }
        return res;
    }
    async GetById(id, expression) {
        let objectid = null;
        try {
            objectid = mongoose.Types.ObjectId(id);
        }
        catch (err) {
            return null;
        }
        let res;
        if (expression) {
            res = (await expression(this.entity.getModelForClass(this.entityType)).findOne({ _id: objectid }));
        }
        else {
            res = await this.entity.getModelForClass(this.entityType).findById(objectid);
        }
        if (res) {
            return res.toObject();
        }
        return null;
    }
    async Add(entity) {
        const Model = this.entity.getModelForClass(this.entityType);
        const res = await new Model(entity).save();
        this.logger.debug(`Repository [${this.entityType.name}]: Item '${getid_1.getid(res)}' added`);
        this.observerListener.addEvent(this.entityType, res, repository_observer_1.ObserverEventType.Added);
        return res;
    }
    async Update(id, entity) {
        const Model = this.entity.getModelForClass(this.entityType);
        const res = await Model.findByIdAndUpdate(mongoose.Types.ObjectId(id), entity);
        if (!res) {
            throw new Error('Cannot save content, modified 0');
        }
        this.logger.debug(`Repository [${this.entityType.name}]: Item '${getid_1.getid(res)}' updated`);
        this.observerListener.addEvent(this.entityType, entity, repository_observer_1.ObserverEventType.Modified);
        return entity;
    }
    async Delete(id) {
        const Model = this.entity.getModelForClass(this.entityType);
        const res = await Model.findByIdAndDelete(mongoose.Types.ObjectId(id));
        if (!res) {
            throw new Error('Cannot delete image, deleted 0');
        }
        this.logger.debug(`Repository [${this.entityType.name}]: Item '${getid_1.getid(res)}' removed`);
        this.observerListener.addEvent(this.entityType, res, repository_observer_1.ObserverEventType.Removed);
    }
    create(type) {
        return new type();
    }
};
__decorate([
    inversify_1.inject(repository_observer_1.ObserverListener),
    __metadata("design:type", repository_observer_1.ObserverListener)
], RepositoryData.prototype, "observerListener", void 0);
RepositoryData = RepositoryData_1 = __decorate([
    inversify_1.injectable(),
    __param(0, inversify_1.inject('entityType')),
    __metadata("design:paramtypes", [Object])
], RepositoryData);
exports.RepositoryData = RepositoryData;
//# sourceMappingURL=repository.data.js.map