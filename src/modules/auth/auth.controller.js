import { Router } from "express";
import { asyncHandler } from "../../utils/error handling/asynchandler.js";
import validation from "../../middleware/validation.middleware.js";
import * as authService from "./auth.service.js";
import * as authScheme from "./auth.validation.js";

const router = Router();

/**
 * @route   POST /auth/signup
 * @desc    Register a new user
 * @access  Public
 */
router.post(
  "/signup",
  validation(authScheme.signup),
  asyncHandler(authService.signup)
);

/**
 * @route   POST /auth/confirm-otp
 * @desc    Confirm OTP for registration
 * @access  Public
 */
router.post(
  "/confirm-otp",
  validation(authScheme.confirmOTP),
  asyncHandler(authService.confirmOTP)
);

/**
 * @route   POST /auth/signin
 * @desc    Sign in a user (only for system provider)
 * @access  Public
 */
router.post(
  "/signin",
  validation(authScheme.signin),
  asyncHandler(authService.signin)
);

/**
 * @route   POST /auth/signup-with-google
 * @desc    Sign up with Google
 * @access  Public
 */
router.post(
  "/signup-with-google",
  validation(authScheme.signupWithGoogle),
  asyncHandler(authService.signupOrLoginWithGoogle)
);

/**
 * @route   POST /auth/login-with-google
 * @desc    Login with Google
 * @access  Public
 */
router.post(
  "/login-with-google",
  validation(authScheme.loginWithGoogle),
  asyncHandler(authService.signupOrLoginWithGoogle)
);

/**
 * @route   POST /auth/forget-password
 * @desc    Send OTP for forget password
 * @access  Public
 */
router.post(
  "/forget-password",
  validation(authScheme.forgetPassword),
  asyncHandler(authService.forgetPassword)
);

/**
 * @route   POST /auth/reset-password
 * @desc    Reset password
 * @access  Public
 */
router.post(
  "/reset-password",
  validation(authScheme.resetPassword),
  asyncHandler(authService.resetPassword)
);

/**
 * @route   POST /auth/refresh-token
 * @desc    Refresh access token
 * @access  Public
 */
router.post(
  "/refresh-token",
  validation(authScheme.refreshToken),
  asyncHandler(authService.refreshToken)
);

export default router;
