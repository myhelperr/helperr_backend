import { Router } from 'express';
import { SignUp, VerifyOTP, ResendOTP, Login, GetProfile, RefreshToken, ForgotPassword, VerifyPasswordResetOTP, ResetPassword, UpdateProfile } from '../controllers/authController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();

router.post('/signup', SignUp);

router.post('/resend-otp', ResendOTP);

router.post('/verify-otp', VerifyOTP);

router.post('/login', Login);

router.get('/refresh-token', RefreshToken);

router.post('/forgot-password', ForgotPassword);

router.post('/verify-password-reset', VerifyPasswordResetOTP);

router.post('/reset-password', ResetPassword);

router.get('/get-profile', authMiddleware, GetProfile);

router.patch('/update-profile', authMiddleware, UpdateProfile);

export default router;
