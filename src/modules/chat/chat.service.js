import Chat from "./../../DB/models/chat.model.js";


export const getChatHistory = async (req, res, next) => {
  const { userId } = req.params;
  const currentUserId = req.user._id;

  if (!userId) {
    return next(new Error("User id is required!", { cause: 400 }));
  }

  const chat = await Chat.findOne({
    $or: [
      { senderId: currentUserId, receiverId: userId },
      { senderId: userId, receiverId: currentUserId },
    ],
  })
    .populate("senderId", "username profilePic")
    .populate("receiverId", "username profilePic")
    .populate("messages.senderId", "username profilePic");

  if (!chat) {
    return res.status(200).json({
      success: true,
      results: { chatHistory: [] },
    });
  }

  return res.status(200).json({
    success: true,
    results: { chatHistory: chat.messages },
  });
};
