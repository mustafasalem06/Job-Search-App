import { Router } from "express";
import { asyncHandler } from "../../utils/error handling/asynchandler.js";
import validation from "../../middleware/validation.middleware.js";
import isAuthenticated from "../../middleware/authentication.middleware.js";
import isAuthorized from "../../middleware/authorization.middleware.js";
import userEndpoint from "./user.endpoints.js";
import * as userService from "./user.service.js";
import * as userScheme from "./user.validation.js";
import { uploadCloud } from "../../utils/file uploading/multerCloud.js";
import { fileValidation } from "../../utils/constants/cloudinaryConstants.js";

const router = Router();

/**
 * @route   PATCH /user/update
 * @desc    Update user account (mobileNumber, DOB, firstName, lastName, gender)
 * @access  Private (User only)
 */
router.patch(
  "/update",
  isAuthenticated,
  isAuthorized(userEndpoint.updateUser),
  validation(userScheme.updateUser),
  asyncHandler(userService.updateUser)
);

/**
 * @route   GET /user/profile
 * @desc    Get login user account data (decrypt mobileNumber)
 * @access  Private (User only)
 */
router.get(
  "/profile",
  isAuthenticated,
  isAuthorized(userEndpoint.getProfile),
  asyncHandler(userService.getLoginUserProfile)
);

/**
 * @route   GET /user/profile/:userId
 * @desc    Get profile data for another user (userName, mobileNumber, profilePic, coverPic)
 * @access  Private (User only)
 */
router.get(
  "/profile/:userId",
  isAuthenticated,
  isAuthorized(userEndpoint.getUserProfile),
  asyncHandler(userService.getUserProfileById)
);

/**
 * @route   PATCH /user/update-password
 * @desc    Update user password
 * @access  Private (User only)
 */
router.patch(
  "/update-password",
  isAuthenticated,
  isAuthorized(userEndpoint.updatePassword),
  validation(userScheme.updatePassword),
  asyncHandler(userService.updatePassword)
);

/**
 * @route   POST /user/upload-profile-pic
 * @desc    Upload profile picture
 * @access  Private (User only)
 */
router.post(
  "/upload-profile-pic",
  isAuthenticated,
  isAuthorized(userEndpoint.uploadProfilePic),
  uploadCloud().single("image"),
  validation(userScheme.uploadProfilePic),
  asyncHandler(userService.uploadProfilePic)
);

/**
 * @route   POST /user/upload-cover-pic
 * @desc    Upload cover picture
 * @access  Private (User only)
 */
router.post(
  "/upload-cover-pic",
  isAuthenticated,
  isAuthorized(userEndpoint.uploadCoverPic),
  uploadCloud(fileValidation.images).single("image"),
  validation(userScheme.uploadCoverPic),
  asyncHandler(userService.uploadCoverPic)
);

/**
 * @route   DELETE /user/delete-profile-pic
 * @desc    Delete profile picture
 * @access  Private (User only)
 */
router.delete(
  "/delete-profile-pic",
  isAuthenticated,
  isAuthorized(userEndpoint.deleteProfilePic),
  asyncHandler(userService.deleteProfilePic)
);

/**
 * @route   DELETE /user/delete-cover-pic
 * @desc    Delete cover picture
 * @access  Private (User only)
 */
router.delete(
  "/delete-cover-pic",
  isAuthenticated,
  isAuthorized(userEndpoint.deleteCoverPic),
  asyncHandler(userService.deleteCoverPic)
);

/**
 * @route   PATCH /user/soft-delete
 * @desc    Soft delete user account
 * @access  Private (User only)
 */
router.patch(
  "/soft-delete",
  isAuthenticated,
  isAuthorized(userEndpoint.softDelete),
  asyncHandler(userService.softDeleteUser)
);

export default router;