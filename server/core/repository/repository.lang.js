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
const repository_data_1 = require("./repository.data");
const localization_1 = require("../localization");
const inversify_1 = require("inversify");
let RepositoryLang = class RepositoryLang extends repository_data_1.RepositoryData {
    constructor(entityType, localization) {
        super(entityType);
        this.localization = localization;
    }
    static of(modelType) {
        if (modelType.name) {
            return 'langrep_' + modelType.name;
        }
        return 'langrep_' + modelType;
    }
    async Get(expression) {
        let res = await super.Get(expression);
        res = this.localization.extract(res, this.entityType);
        return res;
    }
    async GetById(id, expression) {
        let res = await super.GetById(id, expression);
        res = this.localization.extract(res, this.entityType);
        return res;
    }
    async Add(entity) {
        entity = this.localization.pack(entity, this.entityType);
        const res = await super.Add(entity);
        return res;
    }
    async Update(id, entity) {
        const oldEntity = await super.GetById(id);
        entity = this.localization.pack(entity, this.entityType, oldEntity);
        const res = super.Update(id, entity);
        return res;
    }
    async Delete(id) {
        const res = super.Delete(id);
        return res;
    }
};
RepositoryLang = __decorate([
    __param(0, inversify_1.inject('entityType')), __param(1, inversify_1.inject(localization_1.Localization)),
    __metadata("design:paramtypes", [Object, localization_1.Localization])
], RepositoryLang);
exports.RepositoryLang = RepositoryLang;
//# sourceMappingURL=repository.lang.js.map