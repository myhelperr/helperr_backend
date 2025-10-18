import { Request, Response, NextFunction } from 'express';
import createError from 'http-errors';

import { supabase } from '../configs/supaBase';
import prisma from '../configs/prisma';
import catchAsync from '../utils/catchAsync';

export const authMiddleware = catchAsync(
  async (req: Request, __: Response, next: NextFunction) => {
    // Get authorization header
    const authHeader = req.headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next(createError(401, 'No token provided'));
    }

    // Extract token
    const token = authHeader.split(' ')[1];

    if (!token) return next(createError(401, 'Invalid token format'));

    // Verify token with Supabase
    const { data, error } = await supabase.auth.getUser(token);

      if (error || !data.user) {
        return next(createError(401, 'Invalid or expired token'));
      }

      // Get user from database
      const user = await prisma.user.findUnique({
        where: { id: data.user.id },
      });

      if (!user) {
        return next(createError(404, 'User not found'));
      }

      if (!user.isVerified) {
        return next(createError(403, 'Please verify your email first'));
      }

      // Attach user to request object
      req.user = user;

      next();
  }
);