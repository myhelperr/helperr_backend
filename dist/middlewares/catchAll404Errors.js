"use strict";
!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="f88f3ae1-3f26-5573-a094-54e8ac2eb5e6")}catch(e){}}();

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_errors_1 = __importDefault(require("http-errors"));
exports.default = (req, _, next) => {
    return next((0, http_errors_1.default)(404, `Can't ${req.method} '${req.url}'`));
};
//# sourceMappingURL=catchAll404Errors.js.map
//# debugId=f88f3ae1-3f26-5573-a094-54e8ac2eb5e6
