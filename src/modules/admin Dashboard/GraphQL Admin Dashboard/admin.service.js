import User from "../../../DB/models/user.model.js";
import Company from "./../../../DB/models/company.model.js";

export const getAllData = async (_, args, context) => {
  const users = await User.find({}).select("-password").lean();
  const companies = await Company.find({}).lean();

  return {
    success: true,
    statusCode: 200,
    results: {
      users,
      companies,
    },
  };
};
