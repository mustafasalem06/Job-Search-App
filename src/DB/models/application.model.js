import { Schema, model, Types } from "mongoose";
import { applicationStatus } from "../../utils/constants/appConstants.js";

const applicationSchema = new Schema(
  {
    jobId: {
      type: Types.ObjectId,
      ref: "JobOpportunity",
      required: true,
    },
    userId: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
    userCV: {
      secure_url: {
        type: String,
        required: true,
      },
      public_id: {
        type: String,
        required: true,
      },
    },
    status: {
      type: String,
      enum: Object.values(applicationStatus),
      default: applicationStatus.PENDING,
    },
  },
  { timestamps: true }
);

const Application = model("Application", applicationSchema);
export default Application;
