"use strict";
!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="ebb16c16-98db-53af-abcf-df62787e546b")}catch(e){}}();

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Sentry = __importStar(require("@sentry/node"));
const cors_1 = __importDefault(require("cors"));
const authRoute_1 = __importDefault(require("./routes/authRoute"));
const catchAll404Errors_1 = __importDefault(require("./middlewares/catchAll404Errors"));
const errorHandler_1 = __importDefault(require("./middlewares/errorHandler"));
const prisma_1 = require("./configs/prisma");
const rateLimitConfig_1 = require("./configs/rateLimitConfig");
const morganConfig_1 = __importDefault(require("./configs/morganConfig"));
const health_1 = require("./utils/health");
require("./configs/sentryConfig");
const app = (0, express_1.default)();
(0, prisma_1.connectDatabase)();
app.use(rateLimitConfig_1.rateLimiter);
app.use((0, cors_1.default)());
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.json());
app.use(morganConfig_1.default);
app.get('/', async (_, res) => {
    res.status(200).send({
        status: 'success',
        message: 'Api is live',
    });
});
app.use('/health', health_1.healthCheck);
app.use('/api/v1/auth', authRoute_1.default);
app.get('/debug-sentry', (_, __) => {
    throw new Error('My first Sentry error!');
});
Sentry.setupExpressErrorHandler(app);
app.use(catchAll404Errors_1.default);
app.use(errorHandler_1.default);
exports.default = app;
//# sourceMappingURL=app.js.map
//# debugId=ebb16c16-98db-53af-abcf-df62787e546b
