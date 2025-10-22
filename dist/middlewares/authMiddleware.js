"use strict";
!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="53f4c204-717c-5e38-8942-bc3d3318251a")}catch(e){}}();

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const http_errors_1 = __importDefault(require("http-errors"));
const supaBase_1 = require("../configs/supaBase");
const prisma_1 = __importDefault(require("../configs/prisma"));
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
exports.authMiddleware = (0, catchAsync_1.default)(async (req, __, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return next((0, http_errors_1.default)(401, 'No token provided'));
    }
    const token = authHeader.split(' ')[1];
    if (!token)
        return next((0, http_errors_1.default)(401, 'Invalid token format'));
    const { data, error } = await supaBase_1.supabase.auth.getUser(token);
    if (error || !data.user) {
        return next((0, http_errors_1.default)(401, 'Invalid or expired token'));
    }
    const user = await prisma_1.default.user.findUnique({
        where: { id: data.user.id },
    });
    if (!user) {
        return next((0, http_errors_1.default)(404, 'User not found'));
    }
    if (!user.isVerified) {
        return next((0, http_errors_1.default)(403, 'Please verify your email first'));
    }
    req.user = user;
    next();
});
//# sourceMappingURL=authMiddleware.js.map
//# debugId=53f4c204-717c-5e38-8942-bc3d3318251a
