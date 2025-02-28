import joi from "joi";
import { validationSchemas } from "../../utils/constants/joiConstants.js";

// User Update Validation Schema
export const updateUser = joi
  .object({
    firstName: validationSchemas.userSchema.firstname,
    lastName: validationSchemas.userSchema.lastname,
    mobileNumber: validationSchemas.userSchema.mobileNumber,
    gender: validationSchemas.userSchema.gender,
    DOB: validationSchemas.userSchema.DOB,
  })
  .required();

// Update user password
export const updatePassword = joi
  .object({
    oldPassword: validationSchemas.userSchema.password.required(),
    newPassword: validationSchemas.userSchema.password.required(),
    confirmPassword: validationSchemas.userSchema.password.valid(joi.ref("newPassword")).required(),
  })
  .required();

// Upload profile picture
export const uploadProfilePic = joi
  .object({
    file : validationSchemas.globalSchemas.file,
  })
  .required();

// Upload cover picture
export const uploadCoverPic = joi
  .object({
    file : validationSchemas.globalSchemas.file,
  })
  .required();