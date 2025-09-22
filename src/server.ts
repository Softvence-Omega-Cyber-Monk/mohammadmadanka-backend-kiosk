import mongoose from "mongoose";
import app from "./app";
import { createServer, Server } from "http";
import adminSeeder from "./seeder/adminSeeder";
import config from "./config";
import { Server as SocketIOServer } from "socket.io";
import { initSocket } from "./socket";


let server: Server;

async function main() {
  try {
    console.log("connecting to mongodb....⏳");
    await mongoose.connect(config.mongoose_uri);
    await adminSeeder()
    server = createServer(app);

    // attach socket.io
    initSocket(server);

    server.listen(config.port, "0.0.0.0", () => {
      console.log(`Mohammad server app listening on port ${config.port}`);
    });
    // initSocket(server)
    //  const io = new SocketIOServer(server, {
    //   cors: {
    //     origin: [
    //       "http://localhost:5173",
    //       "http://192.168.1.100:5173",
    //       "https://velvety-quokka-7b3cf9.netlify.app",
    //     ],
    //     methods: ["GET", "POST"],
    //     credentials: true,
    //   },
    // });

    // io.on("connection", (socket) => {
    //   console.log("Socket connected:", socket.id);
    // });
  } 
  catch (err:any) {
    throw Error('something went wrong in server or mongoose connection');
  }
}
main();

// Global unhandled promise rejection handler
process.on('unhandledRejection', async (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  // Gracefully shutting down the server
  if (server) {
    try {
      server.close(() => {
        console.log(
          'Server and MongoDB connection closed due to unhandled rejection.',
        );
        process.exit(1); // Exit the process with an error code
      });
    } catch (err) {
      console.error('Error during shutdown:', err);
      process.exit(1); // Exit with error code if shutting down fails
    }
  } else {
    process.exit(1);
  }
});

// Global uncaught exception handler
process.on('uncaughtException', async (err) => {
  console.error('Uncaught Exception:', err);
  // Gracefully shutting down the server
  if (server) {
    try {
      server.close(() => {
        console.log(
          'Server and MongoDB connection closed due to uncaught exception.',
        );
        process.exit(1); // Exit the process with an error code
      });
    } catch (err) {
      console.error('Error during shutdown:', err);
      process.exit(1); // Exit with error code if shutting down fails
    }
  } else {
    process.exit(1);
  }
});
