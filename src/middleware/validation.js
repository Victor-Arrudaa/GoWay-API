import Joi from 'joi';
import { AppError } from '../utils/appError.js';

// ... código existente ...

const adminLoginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

export const validateAdmin = (req, res, next) => {
  const { error } = adminLoginSchema.validate(req.body);
  if (error) {
    throw new AppError(error.details[0].message, 400);
  }
  next();
};