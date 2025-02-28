import { roles } from "../../utils/constants/appConstants.js";

const jobEndpoint = {
  addJob: [roles.USER],
  updateJob: [roles.USER],
  deleteJob: [roles.USER],
  getJobApplications: [roles.USER],
  applyToJob: [roles.USER],
  acceptOrRejectApplicant: [roles.USER],
};

export default jobEndpoint;
