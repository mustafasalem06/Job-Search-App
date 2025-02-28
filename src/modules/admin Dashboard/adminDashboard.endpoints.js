import { roles } from "../../utils/constants/appConstants.js";

const adminEndpoints = {
  banUser: [roles.ADMIN],
  banCompany: [roles.ADMIN],
  approveCompany: [roles.ADMIN],
};

export default adminEndpoints