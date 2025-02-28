import joi from 'joi';
import { validationSchemas } from '../../utils/constants/joiConstants.js';

// Get chat history
export const getChatHistory = joi.object({
    userId: validationSchemas.chatSchema.senderId.required(),
    currentUserId: validationSchemas.chatSchema.senderId.required(),
}).required();