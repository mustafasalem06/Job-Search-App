import { roles } from "../../utils/constants/appConstants.js";

const companyEndpoints = {
  addCompany: [roles.USER],
  updateCompany: [roles.USER],
  softDeleteCompany: [roles.ADMIN, roles.USER],
  uploadLogo: [roles.USER],
  uploadCoverPic: [roles.USER],
  deleteLogo: [roles.USER],
  deleteCoverPic: [roles.USER],
};

export default companyEndpoints;
