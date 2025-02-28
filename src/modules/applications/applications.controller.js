import { Router } from "express";
import { asyncHandler } from "../../utils/error handling/asynchandler.js";
import validation from "../../middleware/validation.middleware.js";
import * as applicationService from "./applications.service.js";
import * as applicationScheme from "./applications.validation.js";

const router = Router();

/**
 * @route   GET /applications/:companyId/:date
 * @desc    Export applications to Excel
 * @access  Private
 */
router.get(
  "/:companyId/:date",
  validation(applicationScheme.exportApplications),
  asyncHandler(applicationService.exportApplicationsToExcel)
);

export default router;
