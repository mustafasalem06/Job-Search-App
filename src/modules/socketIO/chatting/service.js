import { io } from "../index.js";
import { asyncHandler } from "./../../../utils/error handling/asynchandler.js";
import Company from "./../../../DB/models/company.model.js";
import User from "../../../DB/models/user.model.js";
import Chat from "./../../../DB/models/chat.model.js";
import { roles } from "./../../../utils/constants/appConstants.js";

export const startConversation = (socket, io) => {
  return asyncHandler(async (receiverId, companyName) => {
    const senderId = socket.user._id;
    const sender = await User.findById(senderId);
    const company = await Company.findOne({ companyName });
    if (
      company.createdBy.toString() !== sender._id.toString() &&
      !company.HRs.includes(sender._id)
    ) {
      socket.emit("error", {
        message: "Only HR or Company Owner can start a conversation.",
      });
    }

    const receiver = await User.findById(receiverId);
    if (!receiver || receiver.role !== roles.USER) {
      socket.emit("error", {
        message: "You can only start a conversation with a regular user.",
      });
    }

    let chat = await Chat.findOne({
      senderId: senderId,
      receiverId: receiverId,
    });

    if (!chat) {
      chat = new Chat({
        senderId: senderId,
        receiverId: receiverId,
        messages: [],
      });
      await chat.save();
    }

    io.to(receiverId).emit("conversationStarted", {
      chatId: chat._id,
      senderId: senderId,
      receiverId: receiverId,
    });

    socket.emit("conversationStarted", {
      chatId: chat._id,
      senderId: senderId,
      receiverId: receiverId,
    });
  });
};

export const emitSocketEvent = async (companyId, eventName, data) => {
  const company = await Company.findById(companyId).populate("HRs");
  if (company && company.HRs.length > 0) {
    company.HRs.forEach((hr) => {
      io.to(hr._id.toString()).emit(eventName, data);
    });
  }
};
