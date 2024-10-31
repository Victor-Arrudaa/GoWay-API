import { Router } from 'express';
import { register, login, forgotPassword, resetPassword, verifyEmail } from '../controllers/auth.controller.js';
import { validateRegistration, validateLogin } from '../middleware/validation.js';
import { upload } from '../middleware/upload.js';

const router = Router();

router.post('/register', upload.single('profilePhoto'), validateRegistration, register);
router.post('/login', validateLogin, login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.get('/verify-email/:token', verifyEmail);

export default router;