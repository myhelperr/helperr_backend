import { Router } from 'express';
import { SignUp, VerifyOTP, ResendOTP, Login, GetProfile, RefreshToken, ForgotPassword, VerifyPasswordResetOTP, ResetPassword, UpdateProfile, VerifyDocuments, GetAllIdentityVerifications, UpdateIdentityVerificationStatus } from '../controllers/authController';
import { adminAuthMiddleware, authMiddleware } from '../middlewares/authMiddleware';
import { upload } from '../utils/imageUpload';

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

router.post('/verify-documents', authMiddleware, upload.single('documentImage'), VerifyDocuments );

router.get('/get-verification-documents', adminAuthMiddleware, GetAllIdentityVerifications)

router.patch('/update-verification-status/:verificationId', adminAuthMiddleware, UpdateIdentityVerificationStatus)

export default router;
