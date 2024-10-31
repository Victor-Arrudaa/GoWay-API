import { Router } from 'express';
import * as adminController from '../controllers/admin.controller.js';
import { validateAdmin } from '../middleware/validation.js';
import { authMiddleware, adminAuthMiddleware } from '../middleware/auth.js';
import { adminLimiter } from '../middleware/rateLimiter.js';

const router = Router();

// Autenticação
router.post('/login', adminLimiter, validateAdmin, adminController.login);
router.post('/logout', authMiddleware, adminController.logout);
router.post('/forgot-password', adminLimiter, adminController.forgotPassword);
router.post('/reset-password', adminLimiter, adminController.resetPassword);

// Rotas protegidas por autenticação de admin
router.use(authMiddleware, adminAuthMiddleware);

// Gerenciamento de usuários
router.get('/users', adminController.getAllUsers);
router.get('/users/:userId', adminController.getUserDetails);
router.patch('/users/:userId/status', adminController.updateUserStatus);
router.delete('/users/:userId', adminController.deleteUser);

// Gerenciamento de motoristas
router.get('/drivers', adminController.getAllDrivers);
router.get('/drivers/:driverId', adminController.getDriverDetails);
router.patch('/drivers/:driverId/verify', adminController.verifyDriver);
router.patch('/drivers/:driverId/status', adminController.updateDriverStatus);

// Dashboard e análises
router.get('/dashboard', adminController.getDashboardStats);
router.get('/analytics/rides', adminController.getRidesAnalytics);
router.get('/analytics/revenue', adminController.getRevenueAnalytics);
router.get('/analytics/users', adminController.getUsersAnalytics);

// Relatórios
router.get('/reports/rides', adminController.getRidesReport);
router.get('/reports/payments', adminController.getPaymentsReport);
router.get('/reports/complaints', adminController.getComplaintsReport);

export default router;