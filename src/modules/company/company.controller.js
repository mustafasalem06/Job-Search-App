import { Router } from "express";
import { asyncHandler } from "../../utils/error handling/asynchandler.js";
import validation from "../../middleware/validation.middleware.js";
import isAuthenticated from "../../middleware/authentication.middleware.js";
import isAuthorized from "../../middleware/authorization.middleware.js";
import * as companyService from "./company.service.js";
import * as companySchema from "./company.validation.js";
import companyEndpoints from "./company.endpoints.js";
import { uploadCloud } from "../../utils/file uploading/multerCloud.js";
import { fileValidation } from "../../utils/constants/cloudinaryConstants.js";
import jobRouter from "../job/job.controller.js";

const router = Router();
/**
 * @route   /company/:companyName/job
 * merge params into company router and job router
 */
router.use("/:companyName/job", jobRouter);

/**
 * @route   POST /company/add
 * @desc    Add a new company
 * @access  Private (Company Owner)
 */
router.post(
  "/add",
  isAuthenticated,
  isAuthorized(companyEndpoints.addCompany),
  uploadCloud(fileValidation.files).single("legalAttachment"),
  validation(companySchema.addCompany),
  asyncHandler(companyService.addCompany)
);

/**
 * @route   PATCH /company/update/:companyId
 * @desc    Update company data
 * @access  Private (Company Owner only)
 */
router.patch(
  "/update/:companyId",
  isAuthenticated,
  isAuthorized(companyEndpoints.updateCompany),
  validation(companySchema.updateCompany),
  asyncHandler(companyService.updateCompany)
);

/**
 * @route   PATCH /company/soft-delete/:companyId
 * @desc    Soft delete a company
 * @access  Private (Admin or Company Owner)
 */
router.patch(
  "/soft-delete/:companyId",
  isAuthenticated,
  isAuthorized(companyEndpoints.softDeleteCompany),
  validation(companySchema.softDeleteCompany),
  asyncHandler(companyService.softDeleteCompany)
);

/**
 * @route   GET /company/:companyId/get-with-jobs
 * @desc    Get a specific company with related jobs
 * @access  Public
 */
router.get(
  "/:companyId/get-with-jobs",
  validation(companySchema.getCompanyWithJobs),
  asyncHandler(companyService.getCompanyWithJobs)
);

/**
 * @route   GET /company/search
 * @desc    Search for a company by name
 * @access  Public
 */
router.get(
  "/search",
  validation(companySchema.searchCompany),
  asyncHandler(companyService.searchCompany)
);

/**
 * @route   POST /company/upload-logo/:companyId
 * @desc    Upload company logo
 * @access  Private (Company Owner only)
 */
router.post(
  "/upload-logo/:companyId",
  isAuthenticated,
  isAuthorized(companyEndpoints.uploadLogo),
  uploadCloud(fileValidation.images).single("logo"),
  validation(companySchema.uploadLogo),
  asyncHandler(companyService.uploadLogo)
);

/**
 * @route   POST /company/upload-cover-pic/:companyId
 * @desc    Upload company cover picture
 * @access  Private (Company Owner only)
 */
router.post(
  "/upload-cover-pic/:companyId",
  isAuthenticated,
  isAuthorized(companyEndpoints.uploadCoverPic),
  uploadCloud(fileValidation.images).single("image"),
  validation(companySchema.uploadCoverPic),
  asyncHandler(companyService.uploadCoverPic)
);

/**
 * @route   DELETE /company/delete-logo/:companyId
 * @desc    Delete company logo
 * @access  Private (Company Owner only)
 */
router.delete(
  "/delete-logo/:companyId",
  isAuthenticated,
  isAuthorized(companyEndpoints.deleteLogo),
  validation(companySchema.deleteLogo),
  asyncHandler(companyService.deleteLogo)
);

/**
 * @route   DELETE /company/delete-cover-pic/:companyId
 * @desc    Delete company cover picture
 * @access  Private (Company Owner only)
 */
router.delete(
  "/delete-cover-pic/:companyId",
  isAuthenticated,
  isAuthorized(companyEndpoints.deleteCoverPic),
  validation(companySchema.deleteCoverPic),
  asyncHandler(companyService.deleteCoverPic)
);

export default router;
