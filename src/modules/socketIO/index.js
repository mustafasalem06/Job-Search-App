import { Server } from "socket.io";
import * as socketService from "./chatting/service.js";
import socketAuth from "./middleware/authentication.socket.js";

export let io;
export const runSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "*",
    },
  });

  io.use(socketAuth); // Use the socket authentication middleware

  io.on("connection", (socket) => {
    console.log("A user connected");

    // Handle socket events
    socket.on("startConversation", socketService.startConversation(socket, io));
  });
};
