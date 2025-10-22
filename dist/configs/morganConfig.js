"use strict";
!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="77d1becf-06bd-5de5-994a-be23e7e9ff22")}catch(e){}}();

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const morgan_1 = __importDefault(require("morgan"));
const loggerConfig_1 = require("./loggerConfig");
const envConfig_1 = require("./envConfig");
const beeFormat = `:remote-addr - :remote-user [:date[web]] ":method :url [HTTP VERSION=:http-version]" :status :res[content-length] :user-agent :response-time ms`;
const devFormat = `:method :url :status :response-time ms - :res[content-length]`;
const format = envConfig_1.NODE_ENV === 'prod' ? beeFormat : devFormat;
exports.default = (0, morgan_1.default)(format, {
    stream: { write: (message) => loggerConfig_1.globalLog.info(message) },
});
//# sourceMappingURL=morganConfig.js.map
//# debugId=77d1becf-06bd-5de5-994a-be23e7e9ff22
