import joi from "joi";
import { validationSchemas } from "../../utils/constants/joiConstants.js";

export const exportApplications = joi.object({
    companyId: validationSchemas.companySchema.companyId.required(),
    date: validationSchemas.applicationSchema.date.required(),
}).required();
