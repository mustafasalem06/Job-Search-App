import { Server } from "socket.io";
import * as socketService from "./chatting/service.js";
import socketAuth from "./middleware/authentication.socket.js";
import Company from "../../DB/models/company.model.js";

export const runSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "*",
    },
  });

  // io.use(socketAuth); // Use the socket authentication middleware

  io.on("connection", (socket) => {
    console.log("A user connected");

    // Handle socket events
    socket.on("startConversation", socketService.startConversation(socket, io));
    
  });
};

export const emitSocketEvent = async (companyId, eventName, data) => {
  const company = await Company.findById(companyId).populate("HRs");

  if (company && company.HRs.length > 0) {

    company.HRs.forEach((hr) => {
      io.to(hr._id.toString()).emit(eventName, data);
    });
  }
};
