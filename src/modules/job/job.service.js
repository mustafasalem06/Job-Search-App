import Company from "../../DB/models/company.model.js";
import JobOpportunity from "../../DB/models/JobOpportunity.model.js";
import Application from "./../../DB/models/application.model.js";
import {
  applicationStatus,
  roles,
} from "./../../utils/constants/appConstants.js";
import cloudinary from "../../utils/file uploading/cloudinary.config.js";
import { eventEmitter } from "../../utils/emails/email.event.js";
import { emitSocketEvent } from "../socketIO/chatting/service.js";

// Add Job
export const addJob = async (req, res, next) => {
  const { companyId } = req.params;
  const userId = req.user._id;

  const companyDoc = await Company.findById(companyId);
  if (!companyDoc) return next(new Error("Company not found.", { cause: 404 }));

  if (
    companyDoc.createdBy.toString() !== userId.toString() &&
    !companyDoc.HRs.includes(userId)
  ) {
    return next(
      new Error("Only company HR and owner can add a job.", { cause: 403 })
    );
  }

  const job = await JobOpportunity.create({
    ...req.body,
    companyId,
    addedBy: userId,
  });
  return res.status(201).json({ success: true, results: { job } });
};

// Update Job
export const updateJob = async (req, res, next) => {
  const { jobId } = req.params;
  const userId = req.user._id;

  const job = await JobOpportunity.findById(jobId);
  if (!job) return next(new Error("Job not found.", { cause: 404 }));

  const company = await Company.findById(job.companyId);
  if (!company) return next(new Error("Company not found.", { cause: 404 }));

  if (company.createdBy.toString() !== userId.toString()) {
    return next(
      new Error("Only the company owner can update the job.", { cause: 403 })
    );
  }
  const updatedJob = await JobOpportunity.findByIdAndUpdate(jobId, req.body, {
    new: true,
    runValidators: true,
  });

  return res.status(200).json({ success: true, results: { updatedJob } });
};

// Delete Job
export const deleteJob = async (req, res, next) => {
  const { jobId } = req.params;
  const userId = req.user._id;

  const job = await JobOpportunity.findById(jobId);
  if (!job) return next(new Error("Job not found.", { cause: 404 }));

  const company = await Company.findById(job.companyId);

  if (!company.HRs.includes(userId)) {
    return next(
      new Error("Only the company HR can delete the job.", {
        cause: 403,
      })
    );
  }

  await JobOpportunity.findByIdAndDelete(jobId);
  return res
    .status(200)
    .json({ success: true, message: "Job deleted successfully." });
};

// Get all Jobs or a specific one for a specific company
export const getJobsForCompany = async (req, res, next) => {
  const { jobId, companyName } = req.params;
  const { page = 1, limit = 10, sort = "-createdAt" } = req.query;

  let filter = {};

  if (!jobId && !companyName) {
    return next(
      new Error("Please provide either jobId or companyName.", {
        cause: 400,
      })
    );
  }

  if (companyName) {
    const company = await Company.findOne({
      companyName: { $regex: companyName, $options: "i" },
    });
    if (!company) {
      return next(new Error("Company not found.", { cause: 404 }));
    }
    filter.companyId = company._id;
  } else if (jobId) {
    filter._id = jobId;
  }

  const {
    results: jobs,
    totalCount,
    page: currentPage,
    limit: currentLimit,
    totalPages,
  } = await JobOpportunity.find(filter).paginate({ page, limit, sort });

  if (!jobs || jobs.length === 0) {
    return next(new Error("No jobs found for this company.", { cause: 404 }));
  }

  return res.status(200).json({
    success: true,
    results: {
      jobs,
      totalCount,
      page: currentPage,
      limit: currentLimit,
      totalPages,
    },
  });
};

// Get all Jobs with filters
export const getJobsWithFilters = async (req, res, next) => {
  const {
    workingTime,
    jobLocation,
    seniorityLevel,
    jobTitle,
    technicalSkills,
    page = 1,
    limit = 10,
    sort = "-createdAt",
  } = req.query;

  const filters = {};
  if (workingTime) filters.workingTime = workingTime;
  if (jobLocation) filters.jobLocation = jobLocation;
  if (seniorityLevel) filters.seniorityLevel = seniorityLevel;
  if (jobTitle) filters.jobTitle = { $regex: jobTitle, $options: "i" };
  if (technicalSkills)
    filters.technicalSkills = { $in: technicalSkills.split(",") };

  const {
    results: jobs,
    totalCount,
    page: currentPage,
    limit: currentLimit,
    totalPages,
  } = await JobOpportunity.find(filters).paginate({ page, limit, sort });

  return res.status(200).json({
    success: true,
    results: {
      jobs,
      totalCount,
      page: currentPage,
      limit: currentLimit,
      totalPages,
    },
  });
};

// Get all applications for a specific Job
export const getJobApplications = async (req, res, next) => {
  const { jobId } = req.params;
  const { page = 1, limit = 10, sort = "-createdAt" } = req.query;
  const userId = req.user._id;

  const job = await JobOpportunity.findById(jobId)
    .populate({
      path: "applications",
      populate: {
        path: "userId",
        select: "-password -__v -_id",
      },
    })
    .paginate({ page, limit, sort });

  if (!job) return next(new Error("Job not found.", { cause: 404 }));
  console.log(job.results.companyId);
  console.log(job);

  const company = await Company.findById(job.results.companyId);
  if (!company) return next(new Error("Company not found.", { cause: 404 }));

  if (
    company.createdBy.toString() !== userId.toString() &&
    !company.HRs.includes(userId)
  ) {
    return next(
      new Error("Only the company owner or HR can view applications.", {
        cause: 403,
      })
    );
  }

  return res.status(200).json({
    success: true,
    data: {
      applications: job.results.applications,
      pagination: {
        page: job.page,
        limit: job.limit,
        totalCount: job.totalCount,
        totalPages: job.totalPages,
      },
    },
  });
};

// Apply to Job
export const applyToJob = async (req, res, next) => {
  const { jobId } = req.params;
  const userId = req.user._id;

  if (req.user.role !== roles.USER) {
    return next(new Error("Only users can apply to jobs.", { cause: 403 }));
  }

  // Populate the companyId field with the companyName
  const job = await JobOpportunity.findById(jobId).populate(
    "companyId",
    "companyName"
  );
  if (!job) return next(new Error("Job not found.", { cause: 404 }));

  const existingApplication = await Application.findOne({
    jobId,
    userId,
  });
  if (existingApplication) {
    return next(
      new Error("You have already applied to this job.", { cause: 400 })
    );
  }

  let userCVUrl = null;
  if (req.file) {
    const { secure_url, public_id } = await cloudinary.uploader.upload(
      req.file.path,
      {
        folder: `${process.env.CLOUD_FOLDER_NAME}/companies/${job.companyId.companyName}/jobs/${jobId}/job-applications/${userId}`,
        resource_type: "auto",
      }
    );
    userCVUrl = { secure_url, public_id };
  } else {
    return next(new Error("Please upload your CV.", { cause: 400 }));
  }

  const application = await Application.create({
    jobId,
    userId,
    userCV: userCVUrl,
  });

  emitSocketEvent(job.companyId, "new-application", { application });

  return res.status(201).json({
    success: true,
    message: "Application submitted successfully.",
    results: { application },
  });
};

// Accept or Reject an applicant for a specific job
export const acceptOrRejectApplicant = async (req, res, next) => {
  const { applicationId } = req.params;
  const { status } = req.body;
  const userId = req.user._id;

  const application = await Application.findById(applicationId)
    .populate({
      path: "jobId",
      select: "companyId",
      populate: {
        path: "companyId",
        select: "HRs",
      },
    })
    .populate({
      path: "userId",
      select: "email",
    });

  if (!application) {
    return next(new Error("Application not found.", { cause: 404 }));
  }

  const company = application.jobId.companyId;
  if (!company.HRs.includes(userId)) {
    return next(
      new Error("Only the company HR can accept or reject the application.", {
        cause: 403,
      })
    );
  }

  application.status = status;
  await application.save();

  const emailSubject =
    status === applicationStatus.ACCEPTED
      ? "Application Accepted"
      : "Application Rejected";

  eventEmitter.emit(
    "NEW_APPLICATION_STATUS",
    application.userId.email,
    application.status,
    emailSubject
  );

  return res.status(200).json({
    success: true,
    message: `Application ${status} successfully.`,
  });
};
