import rateLimit from 'express-rate-limit';
import { NODE_ENV } from './envConfig';

// Simple rate limiter for all routes
export const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: NODE_ENV === 'prod' ? 100 : 1000, // 100 requests per 15 minutes in production, 1000 in development
  message: {
    status: 'error',
    message: 'Too many requests, please try again later.',
  },
  standardHeaders: true, // Return rate limit info in headers
  legacyHeaders: false, // Disable legacy headers
//   keyGenerator: (req) => {
//     // VPN-friendly: Use IP + User-Agent for better distribution
//     const ip = req.ip || 'unknown';
//     const userAgent = req.get('User-Agent') || 'unknown';
//     const userAgentHash = Buffer.from(userAgent).toString('base64').substring(0, 10);
//     return `${ip}:${userAgentHash}`;
//   },
});
