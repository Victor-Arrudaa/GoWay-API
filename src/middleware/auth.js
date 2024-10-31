import jwt from 'jsonwebtoken';
import { AppError } from '../utils/appError.js';
import Admin from '../models/Admin.js';

export const adminAuthMiddleware = async (req, res, next) => {
  try {
    const admin = await Admin.findById(req.userId);
    
    if (!admin || admin.status !== 'active') {
      throw new AppError('Unauthorized access', 401);
    }

    req.admin = admin;
    next();
  } catch (error) {
    next(new AppError('Unauthorized access', 401));
  }
};