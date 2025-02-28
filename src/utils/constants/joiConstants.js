import joi from "joi";
import {
  applicationStatus,
  genders,
  jobLocation,
  numberOfEmployeesRanges,
  roles,
  seniorityLevel,
  workingTime,
} from "./appConstants.js";
import { OTP_TYPES } from "./authConstants.js";
import { isValidObjectId } from "../../middleware/validation.middleware.js";

export const validationSchemas = {
  userSchema: {
    firstname: joi.string().min(3).max(15),
    lastname: joi.string().min(3).max(15),
    email: joi.string().email(),
    password: joi.string().min(8).max(15),
    confirmPassword: joi.string().valid(joi.ref("password")),
    mobileNumber: joi.string(),
    DOB: joi.date(),
    gender: joi.string().valid(...Object.values(genders)),
    role: joi.string().valid(...Object.values(roles)),
    otp: joi.string(),
    type: joi.string().valid(...Object.values(OTP_TYPES)),
    refreshToken: joi.string(),
    userId: joi.custom(isValidObjectId),
  },
  companySchema: {
    companyName: joi.string(),
    description: joi.string(),
    industry: joi.string(),
    address: joi.string(),
    numberOfEmployees: joi.string().valid(...numberOfEmployeesRanges),
    companyEmail: joi.string().email(),
    companyId: joi.custom(isValidObjectId),
    HRs: joi.array().items(joi.custom(isValidObjectId)),
  },
  jobOpportunitySchema: {
    jobTitle: joi.string(),
    jobLocation: joi.string().valid(...Object.values(jobLocation)),
    workingTime: joi.string().valid(...Object.values(workingTime)),
    seniorityLevel: joi.string().valid(...Object.values(seniorityLevel)),
    jobDescription: joi.string(),
    technicalSkills: joi.array(),
    softSkills: joi.array(),
    status: joi.string().valid(...Object.values(applicationStatus)),
    jobId: joi.custom(isValidObjectId),
  },
  applicationSchema: {
    jobId: joi.custom(isValidObjectId),
    userId: joi.custom(isValidObjectId),
    userCV: joi.string(),
    status: joi.string().valid(...Object.values(applicationStatus)),
    applicationId: joi.custom(isValidObjectId),
    date: joi.date(),
  },
  chatSchema: {
    senderId: joi.custom(isValidObjectId),
    receiverId: joi.custom(isValidObjectId),
    message: joi.string(),
  },
  globalSchemas: {
    file: joi.object({
      fieldname: joi.string().valid("image", "file","logo").required(),
      originalname: joi.string().required(),
      encoding: joi.string().required(),
      mimetype: joi.string().required(),
      destination: joi.string().required(),
      filename: joi.string().required(),
      path: joi.string().required(),
      size: joi.number().positive().required(),
    }),
  },
};
