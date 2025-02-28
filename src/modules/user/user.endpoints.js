import { roles } from "../../utils/constants/appConstants.js";

const userEndpoints = {
  updateUser: [roles.USER],
  getProfile: [roles.USER],
  getUserProfile: [roles.USER],
  updatePassword: [roles.USER],
  uploadProfilePic: [roles.USER],
  uploadCoverPic: [roles.USER],
  deleteProfilePic: [roles.USER],
  deleteCoverPic: [roles.USER],
  softDelete: [roles.USER],
};

export default userEndpoints;
