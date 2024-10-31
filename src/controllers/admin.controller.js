import * as adminService from '../services/admin.service.js';
import { AppError } from '../utils/appError.js';
import logger from '../utils/logger.js';

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const { admin, token } = await adminService.loginAdmin(email, password);

    res.json({
      status: 'success',
      data: {
        admin: {
          id: admin._id,
          email: admin.email,
          fullName: admin.fullName,
          role: admin.role,
          permissions: admin.permissions
        },
        token
      }
    });
  } catch (error) {
    logger.error('Admin login error:', error);
    throw error;
  }
};

export const logout = async (req, res) => {
  try {
    await adminService.logoutAdmin(req.admin.id);
    res.json({
      status: 'success',
      message: 'Logged out successfully'
    });
  } catch (error) {
    logger.error('Admin logout error:', error);
    throw error;
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, search } = req.query;
    const users = await adminService.getUsers({ page, limit, status, search });
    
    res.json({
      status: 'success',
      data: users
    });
  } catch (error) {
    logger.error('Get users error:', error);
    throw error;
  }
};

export const getUserDetails = async (req, res) => {
  try {
    const user = await adminService.getUserById(req.params.userId);
    
    res.json({
      status: 'success',
      data: user
    });
  } catch (error) {
    logger.error('Get user details error:', error);
    throw error;
  }
};

export const updateUserStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const user = await adminService.updateUserStatus(req.params.userId, status);
    
    res.json({
      status: 'success',
      data: user
    });
  } catch (error) {
    logger.error('Update user status error:', error);
    throw error;
  }
};

export const getAllDrivers = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, verificationStatus } = req.query;
    const drivers = await adminService.getDrivers({ page, limit, status, verificationStatus });
    
    res.json({
      status: 'success',
      data: drivers
    });
  } catch (error) {
    logger.error('Get drivers error:', error);
    throw error;
  }
};

export const verifyDriver = async (req, res) => {
  try {
    const { status, notes } = req.body;
    const driver = await adminService.verifyDriver(req.params.driverId, status, notes);
    
    res.json({
      status: 'success',
      data: driver
    });
  } catch (error) {
    logger.error('Verify driver error:', error);
    throw error;
  }
};

export const getDashboardStats = async (req, res) => {
  try {
    const stats = await adminService.getDashboardStats();
    
    res.json({
      status: 'success',
      data: stats
    });
  } catch (error) {
    logger.error('Get dashboard stats error:', error);
    throw error;
  }
};

export const getRidesAnalytics = async (req, res) => {
  try {
    const { startDate, endDate, interval } = req.query;
    const analytics = await adminService.getRidesAnalytics(startDate, endDate, interval);
    
    res.json({
      status: 'success',
      data: analytics
    });
  } catch (error) {
    logger.error('Get rides analytics error:', error);
    throw error;
  }
};

export const getRevenueAnalytics = async (req, res) => {
  try {
    const { startDate, endDate, interval } = req.query;
    const analytics = await adminService.getRevenueAnalytics(startDate, endDate, interval);
    
    res.json({
      status: 'success',
      data: analytics
    });
  } catch (error) {
    logger.error('Get revenue analytics error:', error);
    throw error;
  }
};