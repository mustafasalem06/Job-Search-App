import { Schema, model, Types } from "mongoose";
import {
  jobLocation,
  workingTime,
  seniorityLevel,
} from "../../utils/constants/appConstants.js";

const jobOpportunitySchema = new Schema(
  {
    jobTitle: {
      type: String,
      required: true,
      trim: true,
    },
    jobLocation: {
      type: String,
      required: true,
      enum: Object.values(jobLocation),
    },
    workingTime: {
      type: String,
      required: true,
      enum: Object.values(workingTime),
    },
    seniorityLevel: {
      type: String,
      required: true,
      enum: Object.values(seniorityLevel),
    },
    jobDescription: {
      type: String,
      required: true,
      trim: true,
    },
    technicalSkills: {
      type: [String],
      required: true,
    },
    softSkills: {
      type: [String],
      required: true,
    },
    addedBy: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
    updatedBy: {
      type: Types.ObjectId,
      ref: "User",
    },
    closed: {
      type: Boolean,
      default: false,
    },
    companyId: {
      type: Types.ObjectId,
      ref: "Company",
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    strictQuery: true,
  }
);

jobOpportunitySchema.query.paginate = async function ({
  page = 1,
  limit = 10,
  sort = "-createdAt",
}) {
  const skip = (page - 1) * limit;
  const results = await this.skip(skip).limit(limit).sort(sort);
  const totalCount = await this.model.countDocuments(this.getQuery());

  return {
    results,
    totalCount,
    page,
    limit,
    totalPages: Math.ceil(totalCount / limit),
  };
};

jobOpportunitySchema.virtual("applications", {
  ref: "Application",
  localField: "_id",
  foreignField: "job",
});

const JobOpportunity = model("JobOpportunity", jobOpportunitySchema);
export default JobOpportunity;
