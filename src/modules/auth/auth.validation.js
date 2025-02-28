import joi from "joi";
import { validationSchemas } from "../../utils/constants/joiConstants.js";

// signup validation schema
export const signup = joi
  .object({
    firstName: validationSchemas.userSchema.firstname.required(),
    lastName: validationSchemas.userSchema.lastname.required(),
    email: validationSchemas.userSchema.email.required(),
    password: validationSchemas.userSchema.password.required(),
    confirmPassword: validationSchemas.userSchema.confirmPassword.required(),
    mobileNumber: validationSchemas.userSchema.mobileNumber.required(),
    DOB: validationSchemas.userSchema.DOB.required(),
    gender: validationSchemas.userSchema.gender,
    role: validationSchemas.userSchema.role,
  })
  .required();

// confirm otp validation schema
export const confirmOTP = joi
  .object({
    email: validationSchemas.userSchema.email.required(),
    otp: validationSchemas.userSchema.otp.length(6).required(),
    type: validationSchemas.userSchema.type.required(),
  })
  .required();

// Signin validation schema
export const signin = joi
  .object({
    email: validationSchemas.userSchema.email.required(),
    password: validationSchemas.userSchema.password.required(),
  })
  .required();

// Sign up with Google validation schema
export const signupWithGoogle = joi
  .object({
    idToken: joi.string().required(),
  })
  .required();

// Login with Google validation schema
export const loginWithGoogle = joi
  .object({
    idToken: joi.string().required(),
  })
  .required();

// Forgot password validation schema
export const forgetPassword = joi
  .object({
    email: validationSchemas.userSchema.email.required(),
  })
  .required();

// Reset password validation schema
export const resetPassword = joi
  .object({
    email: validationSchemas.userSchema.email.required(),
    password: validationSchemas.userSchema.password.required(),
    confirmPassword: validationSchemas.userSchema.confirmPassword.required(),
    otp: validationSchemas.userSchema.otp.length(6).required(),
    type: validationSchemas.userSchema.type.required(),
  })
  .required();

// Refresh access token
export const refreshToken = joi
  .object({
    refreshToken: validationSchemas.userSchema.refreshToken.required(),
  })
  .required();
