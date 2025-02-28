import Company from "../../DB/models/company.model.js";
import User from "../../DB/models/user.model.js";

// Ban or unban a specific user
export const banOrUnbanUser = async (req, res, next) => {
  const { userId } = req.params;

  const user = await User.findById(userId);
  if (!user) return next(new Error("User not found", { cause: 404 }));

  user.bannedAt = user.bannedAt ? null : new Date();
  await user.save();

  res.status(200).json({
    success: true,
    message: user.bannedAt
      ? "User banned successfully"
      : "User unbanned successfully",
    data: user,
  });
};

// Ban or unban a specific company
export const banOrUnbanCompany = async (req, res, next) => {
  const { companyId } = req.params;

  const company = await Company.findById(companyId);
  if (!company) return next(new Error("Company not found", { cause: 404 }));

  company.bannedAt = company.bannedAt ? null : new Date();
  await company.save();

  res.status(200).json({
    success: true,
    message: company.bannedAt
      ? "Company banned successfully"
      : "Company unbanned successfully",
    data: company,
  });
};

// Approve a specific company
export const approveCompany = async (req, res, next) => {
  const { companyId } = req.params;

  const company = await Company.findById(companyId);
  if (!company) return next(new Error("Company not found", { cause: 404 }));

  company.approvedByAdmin = true;
  await company.save();

  res.status(200).json({
    success: true,
    message: "Company approved successfully",
    data: company,
  });
};
