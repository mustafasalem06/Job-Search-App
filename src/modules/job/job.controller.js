import { Router } from "express";
import { asyncHandler } from "../../utils/error handling/asynchandler.js";
import validation from "../../middleware/validation.middleware.js";
import isAuthenticated from "../../middleware/authentication.middleware.js";
import isAuthorized from "../../middleware/authorization.middleware.js";
import jobEndpoint from "./job.endpoints.js";
import * as jobService from "./job.service.js";
import * as jobSchema from "./job.validation.js";
import { uploadCloud } from "../../utils/file uploading/multerCloud.js";
import { fileValidation } from "../../utils/constants/cloudinaryConstants.js";

const router = Router({ mergeParams: true });

/**
 * @route   POST /job/:companyId
 * @desc    Add a new job
 * @access  Private (Company HR or Owner only)
 */
router.post(
  "/:companyId",
  isAuthenticated,
  isAuthorized(jobEndpoint.addJob),
  validation(jobSchema.addJob),
  asyncHandler(jobService.addJob)
);

/**
 * @route   PATCH /job/:jobId
 * @desc    Update an existing job
 * @access  Private (Company Owner only)
 */
router.patch(
  "/:jobId",
  isAuthenticated,
  isAuthorized(jobEndpoint.updateJob),
  validation(jobSchema.updateJob),
  asyncHandler(jobService.updateJob)
);

/**
 * @route   DELETE /job/:jobId
 * @desc    Delete a job
 * @access  Private (Company HR only)
 */
router.delete(
  "/:jobId",
  isAuthenticated,
  isAuthorized(jobEndpoint.deleteJob),
  asyncHandler(jobService.deleteJob)
);

/**
 * @route   GET /job/:jobId or /company/:companyName/job
 * @desc    Get all jobs for a specific company
 * @access  Public
 */
router.get(
  "/:jobId",
  validation(jobSchema.getJobsForCompany),
  asyncHandler(jobService.getJobsForCompany)
);

/**
 * @route   GET /job
 * @desc    Get all jobs with optional filters (e.g., location, seniority level)
 * @access  Public
 */
router.get("/", asyncHandler(jobService.getJobsWithFilters));

/**
 * @route   GET /job/:jobId/applications
 * @desc    Get all applications for a specific job
 * @access  Private (Company HR or Owner only)
 */
router.get(
  "/:jobId/applications",
  isAuthenticated,
  isAuthorized(jobEndpoint.getJobApplications),
  validation(jobSchema.getJobApplications),
  asyncHandler(jobService.getJobApplications)
);

/**
 * @route   POST /job/:jobId/apply
 * @desc    Apply to a job
 * @access  Private (User only)
 */
router.post(
  "/:jobId/apply",
  isAuthenticated,
  isAuthorized(jobEndpoint.applyToJob),
  uploadCloud(fileValidation.files).single("userCV"),
  validation(jobSchema.applyToJob),
  asyncHandler(jobService.applyToJob)
);

/**
 * @route   PATCH /job/applications/:applicationId
 * @desc    Accept or reject an applicant
 * @access  Private (Company HR only)
 */
router.patch(
  "/applications/:applicationId",
  isAuthenticated,
  isAuthorized(jobEndpoint.acceptOrRejectApplicant),
  validation(jobSchema.acceptOrRejectApplicant),
  asyncHandler(jobService.acceptOrRejectApplicant)
);

export default router;
