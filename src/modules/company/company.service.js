import Company from "../../DB/models/company.model.js";
import cloudinary from "../../utils/file uploading/cloudinary.config.js";
import {
  defaultPublicID_coverPic,
  defaultPublicID_logoCompany,
  defaultSecureURL_coverPic,
  defaultSecureURL_logoCompany,
} from "../../utils/constants/cloudinaryConstants.js";
import { roles } from "../../utils/constants/appConstants.js";
import User from "../../DB/models/user.model.js";

// Add a new company
export const addCompany = async (req, res, next) => {
  const { companyName, companyEmail, HRs } = req.body;

  // Check if company name already exists
  const existingCompanyByName = await Company.findOne({ companyName });
  if (existingCompanyByName) {
    return next(new Error("Company name already exists.", { cause: 409 }));
  }

  // Check if company email already exists
  const existingCompanyByEmail = await Company.findOne({ companyEmail });
  if (existingCompanyByEmail) {
    return next(new Error("Company email already exists.", { cause: 409 }));
  }

  // Ensure legalAttachment file is present
  if (!req.file) {
    return next(
      new Error("Legal attachment file is required.", { cause: 400 })
    );
  }

  // Check if all HRs exist in the User schema
  if (HRs && HRs.length > 0) {
    const existingUsers = await User.find({ _id: { $in: HRs } });
    if (existingUsers.length !== HRs.length) {
      return next(
        new Error("One or more HRs do not exist in the User schema.", {
          cause: 404,
        })
      );
    }
  }

  let legalAttachment = {};
  // Upload the file to Cloudinary
  const { secure_url, public_id } = await cloudinary.uploader.upload(
    req.file.path,
    {
      folder: `${process.env.CLOUD_FOLDER_NAME}/companies/${companyName}/company-legal-attachment`,
      resource_type: "auto",
    }
  );

  legalAttachment = { secure_url, public_id };

  // Create the new company with the legal attachment
  const newCompany = await Company.create({
    ...req.body,
    legalAttachment,
    createdBy: req.user._id,
  });

  return res.status(201).json({
    success: true,
    results: { newCompany },
  });
};

// Update company data
export const updateCompany = async (req, res, next) => {
  const { companyId } = req.params;
  const updates = { ...req.body };
  const userId = req.user._id;

  const company = await Company.findById(companyId);
  if (!company) {
    return next(new Error("Company not found.", { cause: 404 }));
  }

  if (company.createdBy.toString() !== userId.toString()) {
    return next(
      new Error("You are not authorized to update this company.", {
        cause: 403,
      })
    );
  }

  if (updates.legalAttachment) {
    return next(new Error("Cannot update legal attachment.", { cause: 400 }));
  }

  // Check if HRs are being updated and if they exist in the User schema
  if (updates.HRs && updates.HRs.length > 0) {
    const existingUsers = await User.find({ _id: { $in: updates.HRs } });
    if (existingUsers.length !== updates.HRs.length) {
      return next(
        new Error("One or more HRs do not exist in the User schema.", {
          cause: 404,
        })
      );
    }
  }

  const updatedCompany = await Company.findByIdAndUpdate(
    companyId,
    { $set: updates },
    { new: true, runValidators: true }
  );

  return res.status(200).json({
    success: true,
    message: "Company updated successfully.",
    results: { updatedCompany },
  });
};

// Soft delete a company
export const softDeleteCompany = async (req, res, next) => {
  const { companyId } = req.params;
  const userId = req.user._id;
  const userRole = req.user.role;

  const company = await Company.findById(companyId);
  if (!company) {
    return next(new Error("Company not found.", { cause: 404 }));
  }

  const isOwner = company.createdBy.toString() === userId.toString();
  const isAdmin = userRole === roles.ADMIN;

  if (!isOwner && !isAdmin) {
    return next(
      new Error("Only the admin or company owner can perform this action.", {
        cause: 403,
      })
    );
  }

  company.deletedAt = new Date();
  company.freezed = true;
  await company.save();

  return res.status(200).json({
    success: true,
    message: "Company soft deleted successfully.",
  });
};

// Get company data
export const getCompanyWithJobs = async (req, res, next) => {
  const { companyId } = req.params;

  const company = await Company.findById(companyId).populate("jobs");
  if (!company) return next(new Error("Company not found.", { cause: 404 }));

  return res.status(200).json({
    success: true,
    results: { company },
  });
};

// Search for companies
export const searchCompany = async (req, res, next) => {
  const { companyName } = req.query;

  const companies = await Company.find({
    companyName: { $regex: companyName, $options: "i" },
  });

  if (companies.length === 0) {
    return res.status(200).json({
      success: true,
      message: "No companies found with the given name.",
      results: [],
    });
  }

  return res.status(200).json({
    success: true,
    results: { companies },
  });
};

// Upload company logo and cover picture
export const uploadLogo = async (req, res, next) => {
  const { companyId } = req.params;
  const userId = req.user._id;

  const company = await Company.findById(companyId);
  if (!company) return next(new Error("Company not found.", { cause: 404 }));

  if (company.createdBy.toString() !== userId.toString()) {
    return next(
      new Error("Only the company owner can upload the logo.", { cause: 403 })
    );
  }

  if (!req.file) return next(new Error("No file uploaded!", { cause: 400 }));

  if (company.logo?.public_id) {
    await cloudinary.uploader.destroy(company.logo.public_id);
  }

  const { secure_url, public_id } = await cloudinary.uploader.upload(
    req.file.path,
    {
      folder: `${process.env.CLOUD_FOLDER_NAME}/companies/${company.companyName}/company-logo`,
    }
  );

  company.logo = { secure_url, public_id };
  await company.save();

  return res.status(200).json({
    success: true,
    message: "Company logo uploaded successfully.",
    results: { company },
  });
};

// Upload company logo and cover picture
export const uploadCoverPic = async (req, res, next) => {
  const { companyId } = req.params;
  const userId = req.user._id;

  const company = await Company.findById(companyId);
  if (!company) return next(new Error("Company not found.", { cause: 404 }));

  if (company.createdBy.toString() !== userId.toString()) {
    return next(
      new Error("Only the company owner can upload the cover picture.", {
        cause: 403,
      })
    );
  }

  if (!req.file) return next(new Error("No file uploaded!", { cause: 400 }));

  if (company.coverPic?.public_id) {
    await cloudinary.uploader.destroy(company.coverPic.public_id);
  }

  const { secure_url, public_id } = await cloudinary.uploader.upload(
    req.file.path,
    {
      folder: `${process.env.CLOUD_FOLDER_NAME}/companies/${company.companyName}/company-cover-pic`,
    }
  );

  company.coverPic = { secure_url, public_id };
  await company.save();

  return res.status(200).json({
    success: true,
    message: "Company cover picture uploaded successfully.",
    results: { company },
  });
};

// Delete company logo and cover picture
export const deleteLogo = async (req, res, next) => {
  const { companyId } = req.params;
  const userId = req.user._id;

  const company = await Company.findById(companyId);
  if (!company) return next(new Error("Company not found.", { cause: 404 }));

  if (company.createdBy.toString() !== userId.toString()) {
    return next(
      new Error("Only the company owner can delete the logo.", { cause: 403 })
    );
  }

  if (company.logo.public_id !== defaultPublicID_logoCompany) {
    await cloudinary.uploader.destroy(company.logo.public_id);
  }

  company.logo = {
    secure_url: defaultSecureURL_logoCompany,
    public_id: defaultPublicID_logoCompany,
  };
  await company.save();

  return res.status(200).json({
    success: true,
    message: "Company logo deleted successfully.",
  });
};

// Delete company logo and cover picture
export const deleteCoverPic = async (req, res, next) => {
  const { companyId } = req.params;
  const userId = req.user._id;

  const company = await Company.findById(companyId);
  if (!company) {
    return next(new AppError("Company not found.", 404));
  }

  if (company.createdBy.toString() !== userId.toString()) {
    return next(
      new AppError("Only the company owner can delete the cover picture.", 403)
    );
  }

  if (company.coverPic?.public_id) {
    await cloudinary.uploader.destroy(company.coverPic.public_id);
  }

  company.coverPic = {
    secure_url: defaultSecureURL_coverPic,
    public_id: defaultPublicID_coverPic,
  };
  await company.save();

  return res.status(200).json({
    success: true,
    message: "Company cover picture deleted successfully.",
  });
};
