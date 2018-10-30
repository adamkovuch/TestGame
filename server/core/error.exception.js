"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class AppError extends Error {
    constructor(code, message, data) {
        super(message);
        this.responsecode = code;
        this.data = data;
    }
}
exports.AppError = AppError;
//# sourceMappingURL=error.exception.js.map