"use strict";
!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="d31d8099-c9f1-577b-9ca1-df3186f06604")}catch(e){}}();

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mailLog = exports.taskLog = exports.authLog = exports.dbLog = exports.globalLog = void 0;
const winston_1 = require("winston");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
require("winston-daily-rotate-file");
const logDir = path_1.default.join(__dirname, '../../', 'logs');
if (!fs_1.default.existsSync(logDir)) {
    fs_1.default.mkdirSync(logDir, { recursive: true });
}
const { combine, timestamp, label, printf, colorize } = winston_1.format;
const logLevels = {
    levels: {
        error: 0,
        warn: 1,
        info: 2,
    },
    colors: {
        error: 'red',
        warn: 'yellow',
        info: 'green',
    },
};
function logger(labelName) {
    return (0, winston_1.createLogger)({
        levels: logLevels.levels,
        format: combine(label({ label: labelName }), timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), printf(({ timestamp, level, message, label }) => {
            return `[${level}] : ${timestamp} [${label}] : ${message}`;
        })),
        transports: [
            new winston_1.transports.Console({
                level: 'info',
                format: winston_1.format.combine(colorize({ all: true }), winston_1.format.simple()),
            }),
            new winston_1.transports.DailyRotateFile({
                level: 'error',
                filename: 'logs/error-%DATE%.log',
                datePattern: 'YYYY-MM-DD-HH',
                zippedArchive: true,
                maxSize: '20m',
                maxFiles: '14d',
                format: winston_1.format.combine(winston_1.format.json(), winston_1.format.timestamp(), winston_1.format.prettyPrint()),
            }),
            new winston_1.transports.DailyRotateFile({
                level: 'info',
                filename: 'logs/combined-%DATE%.log',
                datePattern: 'YYYY-MM-DD-HH',
                zippedArchive: true,
                maxSize: '20m',
                maxFiles: '14d',
                format: winston_1.format.combine(winston_1.format.json(), winston_1.format.timestamp(), winston_1.format.prettyPrint()),
            }),
        ],
    });
}
const globalLog = logger('Global');
exports.globalLog = globalLog;
const dbLog = logger('Database');
exports.dbLog = dbLog;
const authLog = logger('Auth');
exports.authLog = authLog;
const mailLog = logger('Mail');
exports.mailLog = mailLog;
const taskLog = logger('Task');
exports.taskLog = taskLog;
process.on('unhandledRejection', (error) => {
    globalLog.error(`Unhandled Rejection : ${error.message || error}`);
    process.exit(1);
});
process.on('uncaughtException', (error) => {
    globalLog.error(`Uncaught Exceptions : ${error.message || error}`);
    process.exit(1);
});
process.on('warning', (warning) => {
    globalLog.warn(`Warning : ${warning.message || warning}`);
});
//# sourceMappingURL=loggerConfig.js.map
//# debugId=d31d8099-c9f1-577b-9ca1-df3186f06604
