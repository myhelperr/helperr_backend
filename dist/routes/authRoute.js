"use strict";
!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="4c86374a-a03a-5636-99ef-c488970c81bb")}catch(e){}}();

Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = require("../controllers/authController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = (0, express_1.Router)();
router.post('/signup', authController_1.SignUp);
router.post('/resend-otp', authController_1.ResendOTP);
router.post('/verify-otp', authController_1.VerifyOTP);
router.post('/login', authController_1.Login);
router.get('/refresh-token', authController_1.RefreshToken);
router.post('/forgot-password', authController_1.ForgotPassword);
router.post('/verify-password-reset', authController_1.VerifyPasswordResetOTP);
router.post('/reset-password', authController_1.ResetPassword);
router.get('/get-profile', authMiddleware_1.authMiddleware, authController_1.GetProfile);
router.patch('/update-profile', authMiddleware_1.authMiddleware, authController_1.UpdateProfile);
exports.default = router;
//# sourceMappingURL=authRoute.js.map
//# debugId=4c86374a-a03a-5636-99ef-c488970c81bb
