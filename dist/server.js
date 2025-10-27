"use strict";
!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="25dfc3ad-85eb-54c7-936d-103b6f2fc439")}catch(e){}}();

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = require("http");
const app_1 = __importDefault(require("./app"));
const prisma_1 = require("./configs/prisma");
const envConfig_1 = require("./configs/envConfig");
const loggerConfig_1 = require("./configs/loggerConfig");
const DEFAULT_PORT = Number(envConfig_1.PORT);
const httpServer = (0, http_1.createServer)(app_1.default);
httpServer.listen(DEFAULT_PORT, () => {
    loggerConfig_1.globalLog.info(`Server listening on 'http://localhost:${DEFAULT_PORT}'`);
});
process.on('SIGTERM', async () => {
    loggerConfig_1.globalLog.info('SIGTERM received, shutting down gracefully...');
    await (0, prisma_1.disconnectDatabase)();
    httpServer.close(() => {
        loggerConfig_1.globalLog.info('Server closed');
        process.exit(0);
    });
});
process.on('SIGINT', async () => {
    loggerConfig_1.globalLog.info('SIGINT received, shutting down gracefully...');
    await (0, prisma_1.disconnectDatabase)();
    httpServer.close(() => {
        loggerConfig_1.globalLog.info('Server closed');
        process.exit(0);
    });
});
//# sourceMappingURL=server.js.map
//# debugId=25dfc3ad-85eb-54c7-936d-103b6f2fc439
