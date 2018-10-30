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
const inversify_1 = require("inversify");
const repository_data_1 = require("../core/repository/repository.data");
const setting_1 = require("../models/setting");
const getid_1 = require("../extensions/getid");
let SettingService = class SettingService {
    constructor(repository) {
        this.repository = repository;
        this.settingData = [];
    }
    async load() {
        this.settingData.splice(0); //clear
        (await this.repository.Get()).forEach(elem => {
            this.settingData[elem.key] = elem.value;
        });
    }
    get(key) {
        return this.settingData[key];
    }
    set(key, value) {
        this.settingData[key] = value;
        (async () => {
            const settings = await this.repository.Get(e => e.find({ key: key }));
            if (settings.length > 0) {
                const setting = settings[0];
                setting.value = value;
                this.repository.Update(getid_1.getid(setting), setting);
            }
            else {
                const setting = new setting_1.Setting();
                setting.key = key;
                setting.value = value;
                this.repository.Add(setting);
            }
        })();
    }
};
SettingService = __decorate([
    inversify_1.injectable(),
    __param(0, inversify_1.inject(repository_data_1.RepositoryData.of(setting_1.Setting))),
    __metadata("design:paramtypes", [repository_data_1.RepositoryData])
], SettingService);
exports.SettingService = SettingService;
//# sourceMappingURL=setting.service.js.map