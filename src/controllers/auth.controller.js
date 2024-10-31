import { createUser } from '../services/user.service.js';
import { generateToken, validateCredentials, verifyToken } from '../services/auth.service.js';
import { sendEmail } from '../utils/email.js';
import { AppError } from '../utils/appError.js';
import logger from '../utils/logger.js';

export const register = async (req, res) => {
  try {
    const user = await createUser(req.body, req.file?.path);
    const verificationToken = generateToken(user._id, '24h');
    const authToken = generateToken(user._id);

    await sendEmail({
      to: user.email,
      subject: 'Verify your email',
      text: `Please verify your email by clicking this link: ${process.env.FRONTEND_URL}/verify-email/${verificationToken}`
    });

    res.status(201).json({
      status: 'success',
      token: authToken,
      user: {
        id: user._id,
        email: user.email,
        fullName: user.fullName,
        role: user.role
      }
    });
  } catch (error) {
    logger.error('Registration error:', error);
    throw error;
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await validateCredentials(email, password);
    const token = generateToken(user._id);

    res.json({
      status: 'success',
      token,
      user: {
        id: user._id,
        email: user.email,
        fullName: user.fullName,
        role: user.role
      }
    });
  } catch (error) {
    logger.error('Login error:', error);
    throw error;
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await findUserByEmail(email);

    if (!user) {
      throw new AppError('No user found with this email', 404);
    }

    const resetToken = generateToken(user._id, '1h');

    await sendEmail({
      to: email,
      subject: 'Password Reset',
      text: `Click this link to reset your password: ${process.env.FRONTEND_URL}/reset-password/${resetToken}`
    });

    res.json({
      status: 'success',
      message: 'Password reset link sent to email'
    });
  } catch (error) {
    logger.error('Forgot password error:', error);
    throw error;
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    const decoded = verifyToken(token);
    
    const user = await updateUserById(decoded.id, { password: newPassword });

    res.json({
      status: 'success',
      message: 'Password successfully reset'
    });
  } catch (error) {
    logger.error('Reset password error:', error);
    throw error;
  }
};

export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;
    const decoded = verifyToken(token);
    
    await updateUserById(decoded.id, { isVerified: true });

    res.json({
      status: 'success',
      message: 'Email verified successfully'
    });
  } catch (error) {
    logger.error('Email verification error:', error);
    throw error;
  }
};