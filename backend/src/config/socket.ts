import { Server } from "socket.io";
import http from "http";
import { AppError } from "../utils/app.error.js";
import { verifyAccessToken } from "../utils/jwt.js";

// Initialize Socket.io server with authentication middleware
export const initSocket = (server: http.Server) => {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:5000",
      credentials: true,
    },
  });

  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) return next(new AppError("No token", 401));
      const decoded = verifyAccessToken(token);

      // Attch user ID to socker object
      socket.data.userId = decoded.id;
      next();
    } catch (err) {
      next(new AppError("Authentication error", 401));
    }
  })

  // Handle socket connections
  io.on("connection", (socket) => {
    const usreId = socket.data.userId;
    console.log(`User connected: ${usreId}`);

    // Join user-specific room (for individual notification)
    socket.join(`user_${usreId}`);

    socket.on("disconnect", () => {
      console.log(`User disconnected: ${usreId}`);
    });
  })

  return io
};
