import User from '../models/User.js';
import { AppError } from '../utils/appError.js';
import { createStripeCustomer } from './stripe.js';

export const createUser = async (userData, profilePhoto) => {
  const existingUser = await User.findOne({ email: userData.email });
  if (existingUser) {
    throw new AppError('Email already registered', 400);
  }

  const user = await User.create({
    ...userData,
    profilePhoto
  });

  if (userData.role === 'passenger') {
    const stripeCustomer = await createStripeCustomer(userData.email, userData.fullName);
    user.stripeCustomerId = stripeCustomer.id;
    await user.save();
  }

  return user;
};

export const findUserByEmail = async (email) => {
  return User.findOne({ email }).select('+password');
};

export const updateUserById = async (userId, updateData) => {
  const user = await User.findByIdAndUpdate(userId, updateData, {
    new: true,
    runValidators: true
  });

  if (!user) {
    throw new AppError('User not found', 404);
  }

  return user;
};