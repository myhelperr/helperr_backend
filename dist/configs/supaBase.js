"use strict";
!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="6c557dd2-7028-5209-9340-86c1875aec7f")}catch(e){}}();

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.supabaseAdmin = exports.supabase = void 0;
const supabase_js_1 = require("@supabase/supabase-js");
const dotenv_1 = __importDefault(require("dotenv"));
const envConfig_1 = require("./envConfig");
dotenv_1.default.config();
exports.supabase = (0, supabase_js_1.createClient)(envConfig_1.SUPABASE_URL, envConfig_1.SUPABASE_ANON_API_KEY);
exports.supabaseAdmin = (0, supabase_js_1.createClient)(envConfig_1.SUPABASE_URL, envConfig_1.SUPABASE_SERVICE_ROLE_KEY);
//# sourceMappingURL=supaBase.js.map
//# debugId=6c557dd2-7028-5209-9340-86c1875aec7f
