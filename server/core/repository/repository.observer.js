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
var ObserverListener_1;
const inversify_1 = require("inversify");
const logger_1 = require("../logger");
var ObserverEventType;
(function (ObserverEventType) {
    ObserverEventType["Added"] = "added";
    ObserverEventType["Modified"] = "modified";
    ObserverEventType["Removed"] = "removed";
})(ObserverEventType = exports.ObserverEventType || (exports.ObserverEventType = {}));
let ObserverListener = ObserverListener_1 = class ObserverListener {
    constructor() {
        this.logger = logger_1.getLogger(ObserverListener_1);
        this.events = [];
        this.logger.debug('ObserverListener created');
    }
    addEvent(entity_type, entity, event) {
        this.events.push({ entity, entity_type, event });
        this.logger.debug(`Listener added for entity '${entity_type.name}'`);
        this.observe();
    }
    observe(observers = this.lastObservers) {
        if (!observers) {
            return;
        }
        this.lastObservers = observers;
        this.events.forEach(event => {
            observers.forEach(observer => {
                this.logger.debug(`Observing handlers for entity '${event.entity_type.name}'`);
                observer.onDataChanged(event.entity_type, event.entity, event.event);
            });
        });
        this.events.splice(0);
    }
};
ObserverListener = ObserverListener_1 = __decorate([
    inversify_1.injectable(),
    __metadata("design:paramtypes", [])
], ObserverListener);
exports.ObserverListener = ObserverListener;
//# sourceMappingURL=repository.observer.js.map