// socket.ts
import { Server as SocketIOServer } from "socket.io";
import type { Server } from "http";

let io: SocketIOServer;

export function initSocket(server: Server) {
  io = new SocketIOServer(server, {
    cors: {
      origin: [
        "http://localhost:5173",
        "http://192.168.1.100:5173",
        "https://velvety-quokka-7b3cf9.netlify.app",
      ],
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);

    socket.on("disconnect", () => {
      console.log("Socket disconnected:", socket.id);
    });
  });

  return io;
}

export function getIO() {
  if (!io) throw new Error("Socket.io not initialized!");
  return io;
}
