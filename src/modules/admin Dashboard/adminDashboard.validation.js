import joi from 'joi';
import { validationSchemas } from '../../utils/constants/joiConstants.js';

export const banUser = joi.object({
    userId: validationSchemas.userSchema.userId.required(),
}).required();

export const banCompany = joi.object({
    companyId: validationSchemas.companySchema.companyId.required(),
}).required();

export const approveCompany = joi.object({
    companyId: validationSchemas.companySchema.companyId.required(),
}).required();