import Company from "../../../DB/models/company.model.js";
import { io } from "../index.js";

export const startConversation = (socket, io) => {
  return async (receiverId) => {};
};

export const emitSocketEvent = async (companyId, eventName, data) => {
  const company = await Company.findById(companyId).populate("HRs");

  if (company && company.HRs.length > 0) {
    company.HRs.forEach((hr) => {
      io.to(hr._id.toString()).emit(eventName, data);
    });
  }
};
