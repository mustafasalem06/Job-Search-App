import { Schema, model, Types } from "mongoose";
import { roles } from "../../utils/constants/appConstants.js";
import User from "./user.model.js";

const messageSchema = new Schema(
  {
    message: { type: String, required: true, trim: true },
    senderId: { type: Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

const chatSchema = new Schema(
  {
    senderId: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
      validate: {
        validator: async function (value) {
          const user = await User.findById(value);
          return (
            user &&
            (user.role === roles.HR || user.role === roles.COMPANY_OWNER)
          );
        },
        message: "Sender must be an HR or a Company Owner.",
      },
    },
    receiverId: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
    messages: [messageSchema],
  },
  { timestamps: true }
);

const Chat = model("Chat", chatSchema);
export default Chat;
