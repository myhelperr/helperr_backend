"use strict";
!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="be618866-0345-53f4-b289-06bb0d207f14")}catch(e){}}();

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SUPABASE_SERVICE_ROLE_KEY = exports.EMAIL_APP_PASSWORD = exports.EMAIL_USERNAME = exports.SUPABASE_ANON_API_KEY = exports.SUPABASE_URL = exports.DATABASE_URL = exports.DIRECT_URL = exports.SENTRY_DSN = exports.MONGO_URI = exports.NODE_ENV = exports.PORT = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const { PORT, NODE_ENV, MONGO_URI, SENTRY_DSN, DIRECT_URL, DATABASE_URL, SUPABASE_URL, SUPABASE_ANON_API_KEY, EMAIL_USERNAME, EMAIL_APP_PASSWORD, SUPABASE_SERVICE_ROLE_KEY } = process.env;
exports.PORT = PORT;
exports.NODE_ENV = NODE_ENV;
exports.MONGO_URI = MONGO_URI;
exports.SENTRY_DSN = SENTRY_DSN;
exports.DIRECT_URL = DIRECT_URL;
exports.DATABASE_URL = DATABASE_URL;
exports.SUPABASE_URL = SUPABASE_URL;
exports.SUPABASE_ANON_API_KEY = SUPABASE_ANON_API_KEY;
exports.EMAIL_USERNAME = EMAIL_USERNAME;
exports.EMAIL_APP_PASSWORD = EMAIL_APP_PASSWORD;
exports.SUPABASE_SERVICE_ROLE_KEY = SUPABASE_SERVICE_ROLE_KEY;
//# sourceMappingURL=envConfig.js.map
//# debugId=be618866-0345-53f4-b289-06bb0d207f14
