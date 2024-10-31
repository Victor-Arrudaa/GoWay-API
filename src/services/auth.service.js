import jwt from 'jsonwebtoken';
import { AppError } from '../utils/appError.js';
import { findUserByEmail } from './user.service.js';

export const generateToken = (userId, expiresIn = '7d') => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET,
    { expiresIn }
  );
};

export const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    throw new AppError('Invalid or expired token', 401);
  }
};

export const validateCredentials = async (email, password) => {
  const user = await findUserByEmail(email);

  if (!user || !(await user.comparePassword(password))) {
    throw new AppError('Invalid credentials', 401);
  }

  if (!user.isVerified) {
    throw new AppError('Please verify your email first', 401);
  }

  return user;
};