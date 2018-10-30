"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const error_exception_1 = require("./error.exception");
const logger_1 = require("./logger");
class Security {
    constructor(securityPrinciple) {
        this.securityPrinciple = securityPrinciple;
        this.logger = logger_1.getLogger(Security);
    }
    async checkSecurity(req, func) {
        this.logger.info(`Checking security for ${req.originalUrl}`);
        const elem = securetargets.find(elem => elem === func);
        if (elem) {
            for (let i in this.securityPrinciple) {
                this.logger.debug(`${req.originalUrl} checking security`);
                let isAuthorized = await this.securityPrinciple[i].isAuthorized(req);
                if (!isAuthorized) {
                    throw new error_exception_1.AppError(403, 'Not authorized');
                }
            }
        }
        else {
            this.logger.info(`${req.originalUrl} isn't secure`);
        }
        this.logger.info(`Permission grant for ${req.originalUrl}`);
        return true;
    }
}
exports.Security = Security;
var securetargets = new Array();
function secure() {
    return function (target, propertyKey, descriptor) {
        securetargets.push(descriptor.value);
    };
}
exports.secure = secure;
//# sourceMappingURL=security.js.map