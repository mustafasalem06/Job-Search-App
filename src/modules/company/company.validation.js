import joi from "joi";
import { validationSchemas } from "../../utils/constants/joiConstants.js";

// Add Company Validation Schema
export const addCompany = joi
  .object({
    companyName: validationSchemas.companySchema.companyName.required(),
    description: validationSchemas.companySchema.description.required(),
    industry: validationSchemas.companySchema.industry.required(),
    address: validationSchemas.companySchema.address.required(),
    numberOfEmployees:
      validationSchemas.companySchema.numberOfEmployees.required(),
    companyEmail: validationSchemas.companySchema.companyEmail.required(),
    HRs: validationSchemas.companySchema.HRs,
  })
  .required();

// Update Company Data Validation Schema
export const updateCompany = joi
  .object({
    companyName: validationSchemas.companySchema.companyName,
    description: validationSchemas.companySchema.description,
    industry: validationSchemas.companySchema.industry,
    address: validationSchemas.companySchema.address,
    numberOfEmployees: validationSchemas.companySchema.numberOfEmployees,
    companyEmail: validationSchemas.companySchema.companyEmail,
    HRs: validationSchemas.companySchema.HRs,
    companyId: validationSchemas.companySchema.companyId.required(),
  })
  .required();

// Soft Delete Company Validation Schema
export const softDeleteCompany = joi
  .object({
    companyId: validationSchemas.companySchema.companyId.required(),
  })
  .required();

// Get Specific Company with Related Jobs Validation Schema
export const getCompanyWithJobs = joi
  .object({
    companyId: validationSchemas.companySchema.companyId.required(),
  })
  .required();

// Search for a Company by Name Validation Schema
export const searchCompany = joi
  .object({
    companyName: validationSchemas.companySchema.companyName.required(),
  })
  .required();

// Upload Company Logo Validation Schema
export const uploadLogo = joi
  .object({
    companyId: validationSchemas.companySchema.companyId.required(),
  })
  .required();

// Upload Company Cover Picture Validation Schema
export const uploadCoverPic = joi
  .object({
    companyId: validationSchemas.companySchema.companyId.required(),
  })
  .required();

// Delete Company Logo Validation Schema
export const deleteLogo = joi
  .object({
    companyId: validationSchemas.companySchema.companyId.required(),
  })
  .required();

// Delete Company Cover Picture Validation Schema
export const deleteCoverPic = joi
  .object({
    companyId: validationSchemas.companySchema.companyId.required(),
  })
  .required();
