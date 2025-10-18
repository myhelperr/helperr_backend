import { createServer, Server as HttpServer } from 'http';
import app from './app';
import { disconnectDatabase } from './configs/prisma';

import { PORT } from './configs/envConfig';
import { globalLog } from './configs/loggerConfig';

const DEFAULT_PORT = Number(PORT);

const httpServer: HttpServer = createServer(app);

httpServer.listen(DEFAULT_PORT, () => {
  globalLog.info(`Server listening on 'http://localhost:${DEFAULT_PORT}'`);
});

// Graceful shutdown handlers
process.on('SIGTERM', async () => {
  globalLog.info('SIGTERM received, shutting down gracefully...');
  await disconnectDatabase();
  httpServer.close(() => {
    globalLog.info('Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', async () => {
  globalLog.info('SIGINT received, shutting down gracefully...');
  await disconnectDatabase();
  httpServer.close(() => {
    globalLog.info('Server closed');
    process.exit(0);
  });
});
