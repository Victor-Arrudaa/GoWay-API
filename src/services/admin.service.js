import Admin from '../models/Admin.js';
import { Driver } from '../models/User.js';
import { Passenger } from '../models/User.js';
import Ride from '../models/Ride.js';
import { AppError } from '../utils/appError.js';
import { generateToken } from './auth.service.js';
import { sendEmail } from '../utils/email.js';

export const loginAdmin = async (email, password) => {
  const admin = await Admin.findOne({ email }).select('+password');
  
  if (!admin || !(await admin.comparePassword(password))) {
    throw new AppError('Invalid credentials', 401);
  }

  if (admin.status !== 'active') {
    throw new AppError('Your account has been deactivated', 401);
  }

  // Atualiza último login
  admin.lastLogin = new Date();
  admin.loginAttempts.count = 0;
  await admin.save();

  const token = generateToken(admin._id);

  return { admin, token };
};

export const getUsers = async ({ page, limit, status, search }) => {
  const query = {};
  
  if (status) query.status = status;
  if (search) {
    query.$or = [
      { fullName: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } }
    ];
  }

  const users = await Passenger.find(query)
    .skip((page - 1) * limit)
    .limit(limit)
    .sort('-createdAt');

  const total = await Passenger.countDocuments(query);

  return {
    users,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / limit)
    }
  };
};

export const getDrivers = async ({ page, limit, status, verificationStatus }) => {
  const query = {};
  
  if (status) query.status = status;
  if (verificationStatus) query['documents.status'] = verificationStatus;

  const drivers = await Driver.find(query)
    .skip((page - 1) * limit)
    .limit(limit)
    .sort('-createdAt');

  const total = await Driver.countDocuments(query);

  return {
    drivers,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / limit)
    }
  };
};

export const verifyDriver = async (driverId, status, notes) => {
  const driver = await Driver.findById(driverId);
  
  if (!driver) {
    throw new AppError('Driver not found', 404);
  }

  driver.documents.status = status;
  if (notes) driver.documents.notes = notes;

  await driver.save();

  // Envia email de notificação
  await sendEmail({
    to: driver.email,
    subject: `Driver Verification ${status.charAt(0).toUpperCase() + status.slice(1)}`,
    text: `Your driver verification status has been updated to: ${status}`
  });

  return driver;
};

export const getDashboardStats = async () => {
  const today = new Date();
  const startOfDay = new Date(today.setHours(0, 0, 0, 0));
  const endOfDay = new Date(today.setHours(23, 59, 59, 999));

  const [
    totalUsers,
    totalDrivers,
    activeDrivers,
    todayRides,
    totalRides,
    pendingVerifications
  ] = await Promise.all([
    Passenger.countDocuments(),
    Driver.countDocuments(),
    Driver.countDocuments({ isAvailable: true }),
    Ride.countDocuments({
      createdAt: { $gte: startOfDay, $lte: endOfDay }
    }),
    Ride.countDocuments(),
    Driver.countDocuments({ 'documents.status': 'pending' })
  ]);

  return {
    users: {
      total: totalUsers,
      drivers: totalDrivers,
      activeDrivers
    },
    rides: {
      today: todayRides,
      total: totalRides
    },
    pending: {
      verifications: pendingVerifications
    }
  };
};

export const getRidesAnalytics = async (startDate, endDate, interval = 'day') => {
  const matchStage = {
    createdAt: {
      $gte: new Date(startDate),
      $lte: new Date(endDate)
    }
  };

  const groupStage = {
    _id: {
      $dateToString: {
        format: interval === 'day' ? '%Y-%m-%d' : '%Y-%m',
        date: '$createdAt'
      }
    },
    count: { $sum: 1 },
    completed: {
      $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }
    },
    cancelled: {
      $sum: { $cond: [{ $eq: ['$status', 'cancelled'] }, 1, 0] }
    },
    totalRevenue: { $sum: '$price' }
  };

  const analytics = await Ride.aggregate([
    { $match: matchStage },
    { $group: groupStage },
    { $sort: { _id: 1 } }
  ]);

  return analytics;
};

export const getRevenueAnalytics = async (startDate, endDate, interval = 'day') => {
  const matchStage = {
    createdAt: {
      $gte: new Date(startDate),
      $lte: new Date(endDate)
    },
    status: 'completed'
  };

  const groupStage = {
    _id: {
      $dateToString: {
        format: interval === 'day' ? '%Y-%m-%d' : '%Y-%m',
        date: '$createdAt'
      }
    },
    revenue: { $sum: '$price' },
    rides: { $sum: 1 },
    averagePrice: { $avg: '$price' }
  };

  const analytics = await Ride.aggregate([
    { $match: matchStage },
    { $group: groupStage },
    { $sort: { _id: 1 } }
  ]);

  return analytics;
};