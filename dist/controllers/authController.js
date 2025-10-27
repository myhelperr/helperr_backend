"use strict";
!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="d85a1a29-7377-59b9-acca-f0f7df8f1a87")}catch(e){}}();

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateProfile = exports.ResetPassword = exports.VerifyPasswordResetOTP = exports.ForgotPassword = exports.GetProfile = exports.RefreshToken = exports.Login = exports.VerifyOTP = exports.ResendOTP = exports.SignUp = void 0;
const http_errors_1 = __importDefault(require("http-errors"));
const prisma_1 = __importDefault(require("../configs/prisma"));
const supaBase_1 = require("../configs/supaBase");
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const email_1 = require("../utils/email");
exports.SignUp = (0, catchAsync_1.default)(async (req, res, next) => {
    const { email, password, confirmPassword, fullName, homeAddress } = req.body;
    if (!email || !password || !confirmPassword || !fullName) {
        return next((0, http_errors_1.default)(400, 'All fields are required'));
    }
    if (password !== confirmPassword) {
        return next((0, http_errors_1.default)(400, 'Passwords do not match'));
    }
    const existingUser = await prisma_1.default.user.findUnique({ where: { email } });
    if (existingUser)
        return next((0, http_errors_1.default)(400, 'Email already exists'));
    const { data: supaBaseData, error: supaBaseError } = await supaBase_1.supabase.auth.signUp({ email, password });
    if (supaBaseError)
        return next((0, http_errors_1.default)(400, supaBaseError.message));
    const userId = supaBaseData.user?.id;
    if (!userId)
        return next((0, http_errors_1.default)(500, 'Failed to retrieve user ID from Supabase'));
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);
    const accessToken = supaBaseData.session?.access_token || null;
    const refreshToken = supaBaseData.session?.refresh_token || null;
    const newUser = await prisma_1.default.user.create({
        data: {
            id: userId,
            email,
            fullName,
            homeAddress,
            otpCode,
            otpExpiresAt,
            accessToken,
            refreshToken,
        },
    });
    if (!newUser) {
        await prisma_1.default.user.delete({ where: { id: userId } });
        return next((0, http_errors_1.default)(500, 'Failed to create user'));
    }
    await (0, email_1.sendOtpEmail)(fullName, email, otpCode);
    res.status(201).send({
        status: 'success',
        message: 'User created successfully, please verify your email',
    });
});
exports.ResendOTP = (0, catchAsync_1.default)(async (req, res, next) => {
    const { email } = req.body;
    const user = await prisma_1.default.user.findUnique({ where: { email } });
    if (!user)
        return next((0, http_errors_1.default)(404, 'User not found'));
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);
    await prisma_1.default.user.update({
        where: { email },
        data: {
            otpCode,
            otpExpiresAt,
        },
    });
    (0, email_1.resendOtpEmail)(user.fullName, email, otpCode);
    res.status(200).send({
        status: 'success',
        message: 'OTP resent successfully',
    });
});
exports.VerifyOTP = (0, catchAsync_1.default)(async (req, res, next) => {
    const { otpCode } = req.body;
    if (!otpCode) {
        return next((0, http_errors_1.default)(400, 'OTP code is required'));
    }
    const user = await prisma_1.default.user.findFirst({ where: { otpCode } });
    if (!user)
        return next((0, http_errors_1.default)(404, 'Invalid OTP code'));
    if (user.otpExpiresAt && user.otpExpiresAt < new Date()) {
        return next((0, http_errors_1.default)(400, 'OTP code has expired'));
    }
    const headers = {
        'access-token': `${user.accessToken}`,
        'refresh-token': `${user.refreshToken}`,
    };
    await prisma_1.default.user.update({
        where: { email: user.email },
        data: {
            isVerified: true,
            otpCode: null,
            otpExpiresAt: null,
            accessToken: null,
            refreshToken: null,
        },
    });
    res.header(headers).status(200).send({
        status: 'success',
        message: 'Email verified successfully',
    });
});
exports.Login = (0, catchAsync_1.default)(async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password)
        return next((0, http_errors_1.default)(400, 'Email and password are required'));
    const user = await prisma_1.default.user.findUnique({ where: { email } });
    if (!user)
        return next((0, http_errors_1.default)(404, 'User not found'));
    if (!user.isVerified)
        return next((0, http_errors_1.default)(403, 'Please verify your email before logging in'));
    const { data: supaBaseData, error: supaBaseError } = await supaBase_1.supabase.auth.signInWithPassword({ email, password });
    if (supaBaseError)
        return next((0, http_errors_1.default)(400, supaBaseError.message));
    const accessToken = supaBaseData.session?.access_token || null;
    const refreshToken = supaBaseData.session?.refresh_token || null;
    const headers = {
        'access-token': `${accessToken}`,
        'refresh-token': `${refreshToken}`,
    };
    res.header(headers).status(200).send({
        status: 'success',
        message: 'Login successful',
    });
});
exports.RefreshToken = (0, catchAsync_1.default)(async (req, res, next) => {
    const refreshToken = req.headers['refresh-token'];
    if (!refreshToken || typeof refreshToken !== 'string') {
        return next((0, http_errors_1.default)(400, 'Refresh token is required'));
    }
    const { data, error } = await supaBase_1.supabase.auth.refreshSession({
        refresh_token: refreshToken,
    });
    if (error || !data.session) {
        return next((0, http_errors_1.default)(401, `${error?.message}`));
    }
    const headers = {
        'access-token': `${data.session.access_token}`,
        'refresh-token': `${data.session.refresh_token}`,
    };
    res
        .header(headers)
        .status(200)
        .send({
        status: 'success',
        message: 'Session refreshed successfully',
        data: {
            expiresAt: data.session.expires_at,
        },
    });
});
exports.GetProfile = (0, catchAsync_1.default)(async (req, res, __) => {
    const user = req.user;
    res.status(200).send({
        status: 'success',
        message: 'Profile retrieved successfully',
        data: {
            user: {
                email: user?.email,
                fullName: user?.fullName,
                homeAddress: user?.homeAddress,
                isVerified: user?.isVerified,
                picture: user?.picture,
                skills: user?.skills,
                aboutMe: user?.aboutMe,
            },
        },
    });
});
exports.ForgotPassword = (0, catchAsync_1.default)(async (req, res, next) => {
    const { email } = req.body;
    if (!email) {
        return next((0, http_errors_1.default)(400, 'Email is required'));
    }
    const user = await prisma_1.default.user.findUnique({ where: { email } });
    if (!user)
        return next((0, http_errors_1.default)(404, 'User not found'));
    const { data, error } = await supaBase_1.supabaseAdmin.auth.admin.generateLink({
        type: 'recovery',
        email: user.email,
    });
    if (error)
        return next((0, http_errors_1.default)(400, error.message));
    (0, email_1.sendPasswordResetEmail)(user.fullName, email, data?.properties.email_otp);
    res.status(200).send({
        status: 'success',
        message: 'OTP code sent to your email',
    });
});
exports.VerifyPasswordResetOTP = (0, catchAsync_1.default)(async (req, res, next) => {
    const { email, otpCode } = req.body;
    if (!email || !otpCode) {
        return next((0, http_errors_1.default)(400, 'Email and OTP code are required'));
    }
    const { data, error } = await supaBase_1.supabase.auth.verifyOtp({
        email,
        token: otpCode,
        type: 'recovery',
    });
    if (error) {
        return next((0, http_errors_1.default)(400, 'Invalid or expired OTP code'));
    }
    if (!data.session) {
        return next((0, http_errors_1.default)(400, 'Failed to verify OTP'));
    }
    const headers = {
        'access-token': `${data.session.access_token}`,
        'refresh-token': `${data.session.refresh_token}`,
    };
    res.header(headers).status(200).send({
        status: 'success',
        message: 'OTP verified successfully. You can now reset your password.',
    });
});
exports.ResetPassword = (0, catchAsync_1.default)(async (req, res, next) => {
    const refreshToken = req.headers['refresh-token'];
    const { password, confirmPassword } = req.body;
    if (password !== confirmPassword) {
        return next((0, http_errors_1.default)(400, 'Passwords do not match'));
    }
    if (!refreshToken || typeof refreshToken !== 'string') {
        return next((0, http_errors_1.default)(401, 'Refresh token is required'));
    }
    const { data: sessionData, error: sessionError } = await supaBase_1.supabase.auth.refreshSession({
        refresh_token: refreshToken,
    });
    if (sessionError || !sessionData.session) {
        return next((0, http_errors_1.default)(401, 'Invalid or expired refresh token'));
    }
    const { error } = await supaBase_1.supabase.auth.updateUser({ password });
    if (error) {
        return next((0, http_errors_1.default)(400, error.message));
    }
    res.status(200).send({
        status: 'success',
        message: 'Password reset successfully. You can now login with your new password.',
    });
});
exports.UpdateProfile = (0, catchAsync_1.default)(async (req, res, next) => {
    const email = req.user?.email;
    if (!email) {
        return next((0, http_errors_1.default)(400, 'User email not found'));
    }
    const { fullName, homeAddress, skills, aboutMe, picture } = req.body;
    if (!fullName && !homeAddress && !skills && !aboutMe && !picture) {
        return next((0, http_errors_1.default)(400, 'No fields to update'));
    }
    const updatedUser = await prisma_1.default.user.update({
        where: { email },
        data: { fullName, homeAddress, skills, aboutMe, picture },
    });
    res.status(200).send({
        status: 'success',
        message: 'Profile updated successfully',
        data: {
            user: {
                fullName: updatedUser.fullName,
                homeAddress: updatedUser.homeAddress,
                picture: updatedUser.picture,
                skills: updatedUser.skills,
                aboutMe: updatedUser.aboutMe,
            },
        },
    });
});
//# sourceMappingURL=authController.js.map
//# debugId=d85a1a29-7377-59b9-acca-f0f7df8f1a87
