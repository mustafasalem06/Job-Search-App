import { Schema, model, Types } from "mongoose";
import {
  defaultPublicID_logoCompany,
  defaultSecureURL_logoCompany,
} from "../../utils/constants/cloudinaryConstants.js";
import { numberOfEmployeesRanges } from "../../utils/constants/appConstants.js";
import JobOpportunity from "./JobOpportunity.model.js";

const companySchema = new Schema(
  {
    companyName: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    description: { type: String, required: true, trim: true },
    industry: { type: String, required: true, trim: true },
    address: { type: String, required: true, trim: true },
    numberOfEmployees: {
      type: String,
      required: true,
      enum: {
        values: numberOfEmployeesRanges,
        message:
          "Invalid number of employees. Must be one of this ranges: 1-10, 11-20, 21-50, 51-100, 101-200, 201-500, 501+",
      },
    },
    companyEmail: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    createdBy: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
    logo: {
      secure_url: { type: String, default: defaultSecureURL_logoCompany },
      public_id: { type: String, default: defaultPublicID_logoCompany },
    },
    coverPic: { secure_url: String, public_id: String },
    HRs: [{ type: Types.ObjectId, ref: "User" }],
    bannedAt: { type: Date },
    deletedAt: { type: Date },
    freezed: { type: Boolean, default: false },
    legalAttachment: {
      secure_url: String,
      public_id: String,
    },
    approvedByAdmin: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    strictQuery: true,
  }
);

companySchema.virtual("jobs", {
  ref: "JobOpportunity",
  localField: "_id",
  foreignField: "companyId",
});

companySchema.post("save", async function (doc, next) {
  if (doc.deletedAt) {
    await JobOpportunity.updateMany({ companyId: doc._id }, { closed: true });
  }
  return next();
});

const Company = model("Company", companySchema);
export default Company;
