import joi from "joi";
import { validationSchemas } from "../../utils/constants/joiConstants.js";

export const addJob = joi
  .object({
    jobTitle: validationSchemas.jobOpportunitySchema.jobTitle.required(),
    jobLocation: validationSchemas.jobOpportunitySchema.jobLocation.required(),
    workingTime: validationSchemas.jobOpportunitySchema.workingTime.required(),
    seniorityLevel:
      validationSchemas.jobOpportunitySchema.seniorityLevel.required(),
    jobDescription:
      validationSchemas.jobOpportunitySchema.jobDescription.required(),
    technicalSkills:
      validationSchemas.jobOpportunitySchema.technicalSkills.required(),
    softSkills: validationSchemas.jobOpportunitySchema.softSkills.required(),
    companyId: validationSchemas.companySchema.companyId.required(),
  })
  .required();

export const updateJob = joi
  .object({
    jobTitle: validationSchemas.jobOpportunitySchema.jobTitle,
    jobLocation: validationSchemas.jobOpportunitySchema.jobLocation,
    workingTime: validationSchemas.jobOpportunitySchema.workingTime,
    seniorityLevel: validationSchemas.jobOpportunitySchema.seniorityLevel,
    jobDescription: validationSchemas.jobOpportunitySchema.jobDescription,
    technicalSkills: validationSchemas.jobOpportunitySchema.technicalSkills,
    softSkills: validationSchemas.jobOpportunitySchema.softSkills,
    jobId: validationSchemas.jobOpportunitySchema.jobId.required(),
  })
  .required();

export const getJobsForCompany = joi
  .object({
    jobId: joi
      .alternatives()
      .try(
        validationSchemas.jobOpportunitySchema.jobId.required(),
        joi.forbidden()
      ),
    companyName: joi
      .alternatives()
      .try(
        validationSchemas.companySchema.companyName.required(),
        joi.forbidden()
      ),
  })
  .xor("jobId", "companyName")
  .required();

export const getJobApplications = joi
  .object({
    jobId: validationSchemas.jobOpportunitySchema.jobId.required(),
  })
  .required();

export const applyToJob = joi
  .object({
    jobId: validationSchemas.jobOpportunitySchema.jobId.required(),
  })
  .required();

export const acceptOrRejectApplicant = joi
  .object({
    applicationId: validationSchemas.applicationSchema.applicationId.required(),
    status: validationSchemas.jobOpportunitySchema.status.required(),
  })
  .required();
