import { Request, Response, NextFunction } from 'express';
import createError from 'http-errors';

import prisma from '../configs/prisma';
import { supabase, supabaseAdmin } from '../configs/supaBase';
import catchAsync from '../utils/catchAsync';
import {
  resendOtpEmail,
  sendOtpEmail,
  sendPasswordResetEmail,
} from '../utils/email';

export const SignUp = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password, confirmPassword, fullName, homeAddress } =
      req.body;

    // validate input fields
    if (!email || !password || !confirmPassword || !fullName) {
      return next(createError(400, 'All fields are required'));
    }

    if (password !== confirmPassword) {
      return next(createError(400, 'Passwords do not match'));
    }

    //  check if user exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) return next(createError(400, 'Email already exists'));

    // create user in Supabase
    const { data: supaBaseData, error: supaBaseError } =
      await supabase.auth.signUp({ email, password });

    if (supaBaseError) return next(createError(400, supaBaseError.message));
    const userId = supaBaseData.user?.id;
    if (!userId)
      return next(createError(500, 'Failed to retrieve user ID from Supabase'));

    const otpCode = Math.floor(100000 + Math.random() * 900000).toString(); // Generate a 6-digit OTP code
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // Set time to 10 minutes from now
    const accessToken = supaBaseData.session?.access_token || null;
    const refreshToken = supaBaseData.session?.refresh_token || null;

    // create user in Prisma
    const newUser = await prisma.user.create({
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
      // Rollback Supabase user creation if Prisma user creation fails
      await prisma.user.delete({ where: { id: userId } });
      return next(createError(500, 'Failed to create user'));
    }

    await sendOtpEmail(fullName, email, otpCode);

    res.status(201).send({
      status: 'success',
      message: 'User created successfully, please verify your email',
    });
  },
);

export const ResendOTP = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return next(createError(404, 'User not found'));

    const otpCode = Math.floor(100000 + Math.random() * 900000).toString(); // Generate a 6-digit OTP code
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // Set time to 10 minutes from now

    // Update user with new OTP code and expiration
    await prisma.user.update({
      where: { email },
      data: {
        otpCode,
        otpExpiresAt,
      },
    });

    resendOtpEmail(user.fullName, email, otpCode);

    res.status(200).send({
      status: 'success',
      message: 'OTP resent successfully',
    });
  },
);

export const VerifyOTP = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { otpCode } = req.body;

    // Validate input fields
    if (!otpCode) {
      return next(createError(400, 'OTP code is required'));
    }

    // Check if user exists with this OTP code
    const user = await prisma.user.findFirst({ where: { otpCode } });
    if (!user) return next(createError(404, 'Invalid OTP code'));

    // Check if OTP code is expired
    if (user.otpExpiresAt && user.otpExpiresAt < new Date()) {
      return next(createError(400, 'OTP code has expired'));
    }

    const headers = {
      'access-token': `${user.accessToken}`,
      'refresh-token': `${user.refreshToken}`,
    };

    // Mark user as verified
    await prisma.user.update({
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
  },
);

export const Login = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    if (!email || !password)
      return next(createError(400, 'Email and password are required'));

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return next(createError(404, 'User not found'));

    if (!user.isVerified)
      return next(
        createError(403, 'Please verify your email before logging in'),
      );

    // LOGIN WITH SUPABASE
    const { data: supaBaseData, error: supaBaseError } =
      await supabase.auth.signInWithPassword({ email, password });
    if (supaBaseError) return next(createError(400, supaBaseError.message));

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
  },
);

export const RefreshToken = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const refreshToken = req.headers['refresh-token'];

    if (!refreshToken || typeof refreshToken !== 'string') {
      return next(createError(400, 'Refresh token is required'));
    }

    const { data, error } = await supabase.auth.refreshSession({
      refresh_token: refreshToken,
    });

    if (error || !data.session) {
      return next(createError(401, `${error?.message}`));
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
  },
);

export const GetProfile = catchAsync(
  async (req: Request, res: Response, __: NextFunction) => {
    const user = req.user;

    // const user = await prisma.user.findUnique({ where: { id: userId } });

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
  },
);

export const ForgotPassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email } = req.body;

    if (!email) {
      return next(createError(400, 'Email is required'));
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return next(createError(404, 'User not found'));

    const { data, error } = await supabaseAdmin.auth.admin.generateLink({
      type: 'recovery',
      email: user.email,
    });

    if (error) return next(createError(400, error.message));

    sendPasswordResetEmail(user.fullName, email, data?.properties.email_otp);

    res.status(200).send({
      status: 'success',
      message: 'OTP code sent to your email',
    });
  },
);

export const VerifyPasswordResetOTP = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, otpCode } = req.body;

    if (!email || !otpCode) {
      return next(createError(400, 'Email and OTP code are required'));
    }

    // Verify OTP with Supabase
    const { data, error } = await supabase.auth.verifyOtp({
      email,
      token: otpCode,
      type: 'recovery',
    });

    if (error) {
      return next(createError(400, 'Invalid or expired OTP code'));
    }

    if (!data.session) {
      return next(createError(400, 'Failed to verify OTP'));
    }

    const headers = {
      'access-token': `${data.session.access_token}`,
      'refresh-token': `${data.session.refresh_token}`,
    };

    res.header(headers).status(200).send({
      status: 'success',
      message: 'OTP verified successfully. You can now reset your password.',
    });
  },
);

export const ResetPassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const refreshToken = req.headers['refresh-token'];

    const { password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
      return next(createError(400, 'Passwords do not match'));
    }

    if (!refreshToken || typeof refreshToken !== 'string') {
      return next(createError(401, 'Refresh token is required'));
    }

    // Refresh the session using only the refresh token
    const { data: sessionData, error: sessionError } =
      await supabase.auth.refreshSession({
        refresh_token: refreshToken,
      });

    if (sessionError || !sessionData.session) {
      return next(createError(401, 'Invalid or expired refresh token'));
    }

    // Update password using the refreshed session
    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      return next(createError(400, error.message));
    }

    res.status(200).send({
      status: 'success',
      message:
        'Password reset successfully. You can now login with your new password.',
    });
  },
);

export const UpdateProfile = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const email = req.user?.email;
    if (!email) {
      return next(createError(400, 'User email not found'));
    }

    const { fullName, homeAddress, skills, aboutMe, picture } = req.body;

    // Validate that at least one field is being updated
    if (!fullName && !homeAddress && !skills && !aboutMe && !picture) {
      return next(createError(400, 'No fields to update'));
    }

    // Update user in Prisma database
    const updatedUser = await prisma.user.update({
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
  },
);

// export const VerifyDocuments = catchAsync( async(req: Request, res: Response, next: NextFunction) => {

//   // const { state, city, address, gender, IDType, IDImage} = req.body;

// })
