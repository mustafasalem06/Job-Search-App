import { Router } from "express";
import { asyncHandler } from "../../utils/error handling/asynchandler.js";
import isAuthenticated from "../../middleware/authentication.middleware.js";
import isAuthorized from "../../middleware/authorization.middleware.js";
import validation from "../../middleware/validation.middleware.js";
import * as adminService from "./adminDashboard.service.js";
import * as adminScheme from "./adminDashboard.validation.js";
import adminEndpoints from "./adminDashboard.endpoints.js";

const router = Router();

/**
 * @route   PATCH /admin/ban-user/:userId
 * @desc    Ban or unban a specific user
 * @access  Private (Admin only)
 */
router.patch(
  "/ban-user/:userId",
  isAuthenticated,
  isAuthorized(adminEndpoints.banUser),
  validation(adminScheme.banUser),
  asyncHandler(adminService.banOrUnbanUser)
);

/**
 * @route   PATCH /admin/ban-company/:companyId
 * @desc    Ban or unban a specific company
 * @access  Private (Admin only)
 */
router.patch(
  "/ban-company/:companyId",
  isAuthenticated,
  isAuthorized(adminEndpoints.banCompany),
  validation(adminScheme.banCompany),
  asyncHandler(adminService.banOrUnbanCompany)
);

/**
 * @route   PATCH /admin/approve-company/:companyId
 * @desc    Approve a specific company
 * @access  Private (Admin only)
 */
router.patch(
  "/approve-company/:companyId",
  isAuthenticated,
  isAuthorized(adminEndpoints.approveCompany),
  validation(adminScheme.approveCompany),
  asyncHandler(adminService.approveCompany)
);

export default router;
