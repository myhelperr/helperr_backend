import { Request, Response } from 'express';
import prisma from '../configs/prisma';
import catchAsync from './catchAsync';

// Format uptime in readable format
const formatUptime = (seconds: number): string => {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  const parts = [];
  if (days > 0) parts.push(`${days}d`);
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);
  if (secs > 0) parts.push(`${secs}s`);

  return parts.length > 0 ? parts.join(' ') : '0s';
};

// Check Prisma database connection status
const checkDatabaseStatus = async (): Promise<'connected' | 'disconnected'> => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return 'connected';
  } catch (error) {
    return 'disconnected';
  }
};

// Simple ping function
export const pingServer = async (
  url: string,
): Promise<'online' | 'offline'> => {
  try {
    const response = await fetch(url);
    return response.ok ? 'online' : 'offline';
  } catch (error) {
    return 'offline';
  }
};

// Simple health check middleware
export const healthCheck = catchAsync(async (_: Request, res: Response) => {
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
