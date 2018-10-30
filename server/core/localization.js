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
var Localization_1;
const inversify_1 = require("inversify");
const logger_1 = require("./logger");
function lang() {
    return function (target, propertyKey) {
        Localization.langDecorators.push({ target: target.constructor, propertyKey });
    };
}
exports.lang = lang;
let Localization = Localization_1 = class Localization {
    constructor(lang) {
        this.lang = lang;
    }
    extract(model, entityType) {
        return Localization_1.extract(model, this.lang, entityType);
    }
    pack(model, entityType, oldEntity) {
        if (this.lang !== 'none') {
            return Localization_1.pack(model, this.lang, entityType, oldEntity);
        }
        return model;
    }
    static extract(model, lang, entityType) {
        Localization_1.logger.debug(`Extracting [${lang}] model from '${model}'`);
        const children = new Array();
        let obj = model;
        do {
            for (let i in obj) {
                if (!obj[i])
                    continue;
                if (obj[i][lang]) {
                    obj[i] = obj[i][lang];
                    continue;
                }
                if (Localization_1.langDecorators.find(elem => elem.target === entityType && i === elem.propertyKey)) {
                    obj[i] = obj[i]['_def'];
                    continue;
                }
                if (i.charAt(0) == '_' || i.charAt(0) == '$' || !obj[i]) {
                    continue;
                }
                if (typeof obj[i] === 'object') {
                    children.push(obj[i]);
                }
            }
            obj = children.pop();
        } while (obj);
        Localization_1.logger.debug(`Model extracted. Result='${model}'`);
        return model;
    }
    static pack(entity, lang, entityType, oldEntity) {
        Localization_1.logger.debug(`Model packing. Model='${entity}'`);
        for (let i in entity) {
            if (typeof entity[i] === 'string') {
                if (Localization_1.langDecorators.find(elem => elem.target === entityType && i === elem.propertyKey)) {
                    const value = entity[i];
                    if (oldEntity) {
                        entity[i] = oldEntity[i];
                    }
                    else {
                        entity[i] = {};
                    }
                    if (!entity[i]["_def"] || entity[i]["_def"] == '') {
                        entity[i]["_def"] = value;
                    }
                    entity[i][lang] = value;
                }
            }
        }
        Localization_1.logger.debug(`Model packed. Result='${entity}'`);
        return entity;
    }
};
Localization.logger = logger_1.getLogger(Localization_1);
Localization.langDecorators = [];
Localization = Localization_1 = __decorate([
    inversify_1.injectable(),
    __param(0, inversify_1.inject('lang')),
    __metadata("design:paramtypes", [String])
], Localization);
exports.Localization = Localization;
//# sourceMappingURL=localization.js.map