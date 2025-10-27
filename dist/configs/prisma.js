"use strict";
!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="d7d6069c-402e-55b9-8ace-292802741d4f")}catch(e){}}();

Object.defineProperty(exports, "__esModule", { value: true });
exports.disconnectDatabase = exports.connectDatabase = void 0;
const client_1 = require("@prisma/client");
const loggerConfig_1 = require("./loggerConfig");
const prisma = new client_1.PrismaClient();
const connectDatabase = async () => {
    const maxRetries = 5;
    const retryDelay = 2000;
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        loggerConfig_1.dbLog.warn(`Attempting to connect to the database (Attempt ${attempt}/${maxRetries})...`);
        try {
            await prisma.$connect();
            loggerConfig_1.dbLog.info('Database connected successfully');
            return;
        }
        catch (error) {
            loggerConfig_1.dbLog.error(`Database connection attempt ${attempt}/${maxRetries} failed: ${error}`);
            if (attempt === maxRetries) {
                loggerConfig_1.dbLog.error('All database connection attempts failed. Exiting...');
                process.exit(1);
            }
            loggerConfig_1.dbLog.info(`Retrying database connection in ${retryDelay / 1000} seconds...`);
            await new Promise(resolve => setTimeout(resolve, retryDelay));
        }
    }
};
exports.connectDatabase = connectDatabase;
const disconnectDatabase = async () => {
    try {
        await prisma.$disconnect();
        loggerConfig_1.dbLog.info('Database disconnected successfully');
    }
    catch (error) {
        loggerConfig_1.dbLog.error(`Error disconnecting from database: ${error}`);
    }
};
exports.disconnectDatabase = disconnectDatabase;
exports.default = prisma;
//# sourceMappingURL=prisma.js.map
//# debugId=d7d6069c-402e-55b9-8ace-292802741d4f
