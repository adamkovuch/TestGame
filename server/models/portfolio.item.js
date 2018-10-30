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
const typegoose_1 = require("typegoose");
const image_1 = require("./image");
const route_1 = require("../core/models/route");
const db_connection_1 = require("../core/db.connection");
const localization_1 = require("../core/localization");
const portfolio_content_1 = require("./portfolio.content");
class PortfolioItem extends typegoose_1.Typegoose {
}
__decorate([
    typegoose_1.prop({ required: true }),
    localization_1.lang(),
    __metadata("design:type", Object)
], PortfolioItem.prototype, "name", void 0);
__decorate([
    typegoose_1.prop({ required: true, unique: true }),
    __metadata("design:type", Object)
], PortfolioItem.prototype, "link", void 0);
__decorate([
    typegoose_1.prop({ required: true }),
    localization_1.lang(),
    __metadata("design:type", Object)
], PortfolioItem.prototype, "description", void 0);
__decorate([
    typegoose_1.prop({ ref: route_1.Route, required: true }),
    __metadata("design:type", Object)
], PortfolioItem.prototype, "route", void 0);
__decorate([
    typegoose_1.prop({ ref: route_1.Route, required: true }),
    __metadata("design:type", Object)
], PortfolioItem.prototype, "portfolioRoute", void 0);
__decorate([
    typegoose_1.prop(),
    __metadata("design:type", image_1.Image)
], PortfolioItem.prototype, "thumbnail", void 0);
__decorate([
    typegoose_1.arrayProp({ itemsRef: portfolio_content_1.PortfolioContent, required: true, default: [] }),
    __metadata("design:type", Array)
], PortfolioItem.prototype, "content", void 0);
__decorate([
    typegoose_1.prop({ required: true, default: 0 }),
    __metadata("design:type", Number)
], PortfolioItem.prototype, "order", void 0);
exports.PortfolioItem = PortfolioItem;
db_connection_1.DbModels.registerModel(PortfolioItem);
//# sourceMappingURL=portfolio.item.js.map