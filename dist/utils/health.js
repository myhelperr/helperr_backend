"use strict";
!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="74fde1ec-35ea-5421-8adc-aeb0a9e8585f")}catch(e){}}();

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.healthCheck = exports.pingServer = void 0;
const prisma_1 = __importDefault(require("../configs/prisma"));
const catchAsync_1 = __importDefault(require("./catchAsync"));
const formatUptime = (seconds) => {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    const parts = [];
    if (days > 0)
        parts.push(`${days}d`);
    if (hours > 0)
        parts.push(`${hours}h`);
    if (minutes > 0)
        parts.push(`${minutes}m`);
    if (secs > 0)
        parts.push(`${secs}s`);
    return parts.length > 0 ? parts.join(' ') : '0s';
};
const checkDatabaseStatus = async () => {
    try {
        await prisma_1.default.$queryRaw `SELECT 1`;
        return 'connected';
    }
    catch (error) {
        return 'disconnected';
    }
};
const pingServer = async (url) => {
    try {
        const response = await fetch(url);
        return response.ok ? 'online' : 'offline';
    }
    catch (error) {
        return 'offline';
    }
};
exports.pingServer = pingServer;
exports.healthCheck = (0, catchAsync_1.default)(async (_, res) => {
    const dbStatus = await checkDatabaseStatus();
    res.status(200).json({
        status: 'success',
        message: 'Helperr API is healthy',
        timestamp: new Date().toISOString(),
        uptime: formatUptime(Math.floor(process.uptime())),
        database: dbStatus,
        server: 'online',
        memory: {
            used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024) + ' MB',
            total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024) + ' MB',
        },
        environment: process.env.NODE_ENV || 'development',
    });
});
//# sourceMappingURL=health.js.map
//# debugId=74fde1ec-35ea-5421-8adc-aeb0a9e8585f
