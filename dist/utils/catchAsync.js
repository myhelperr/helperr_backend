"use strict";
!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="9495b4b9-59f5-5c7f-b49e-08608ee5a6d9")}catch(e){}}();

Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (fn) => {
    return (req, res, next) => {
        fn(req, res, next).catch(next);
    };
};
//# sourceMappingURL=catchAsync.js.map
//# debugId=9495b4b9-59f5-5c7f-b49e-08608ee5a6d9
