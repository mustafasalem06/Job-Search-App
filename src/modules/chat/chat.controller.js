import { Router } from "express";
import { asyncHandler } from "../../utils/error handling/asynchandler.js";
import validation from "../../middleware/validation.middleware.js";
import isAuthenticated from "../../middleware/authentication.middleware.js";
import isAuthorized from "../../middleware/authorization.middleware.js";
import * as chatService from "./chat.service.js";
import * as chatScheme from "./chat.validation.js";
import chatEndpoint from "./chat.endpoints.js";

const router = Router();

/**
 * @route   GET /chat/:userId
 * @desc    Get chat history with specific user
 * @access  Private (User only)
 */
router.get(
  "/:userId",
  isAuthenticated,
  isAuthorized(chatEndpoint.getChatHistory),
  validation(chatScheme.getChatHistory),
  asyncHandler(chatService.getChatHistory)
);

export default router;
