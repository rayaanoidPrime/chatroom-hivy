import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import "dotenv/config";
import { InMemorySessionStore } from "./sessionStore.js";
import crypto from "crypto";

const randomId = () => {
  crypto.randomBytes(8).toString("hex");
};

export const setupSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL,
      methods: ["GET", "POST"],
    },
  });

  const sessionStore = new InMemorySessionStore();
  const connectedUsers = [];

  io.use(async (socket, next) => {
    if (socket.handshake.auth && socket.handshake.auth.token) {
      try {
        const decoded = jwt.verify(
          socket.handshake.query.token,
          process.env.JWT_SECRET
        );
        if (!decoded.userId || !decoded.username) {
          throw new Error("UserId not found or invalid");
        }

        const sessionId = socket.handshake.auth.sessionId;
        if (sessionId) {
          //find existing session
          const session = await sessionStore.findSession(sessionId);
          if (session) {
            socket.sessionId = sessionId;
            socket.userId = session.userId;
            socket.username = session.username;
            return next();
          }
        }

        // create new session
        socket.sessionId = randomId();
        socket.userId = decoded.userId;
        socket.username = decoded.username;

        next();
      } catch (err) {
        next(new Error("Authentication error"));
      }
    } else {
      next(new Error("Authentication error"));
    }
  });

  io.on("connection", async (socket) => {
    console.log(`User ${socket.userId} connected with client ${socket.id}`);

    //save session
    await sessionStore.saveSession(socket.sessionId, {
      username: socket.username,
      userId: socket.userId,
      connected: true,
    });

    // emit session details
    socket.emit("session", {
      sessionId: socket.sessionId,
      userId: socket.userId,
      username: socket.username,
    });

    // join userId room
    socket.join(socket.userId);

    sessionStore.findAllSessions().then((sessions) => {
      sessions.forEach((session) => {
        connectedUsers.push({
          userId: session.userId,
          connected: true,
        });
      });
    });

    // Broadcast connected users
    socket.emit("connectedUsers", connectedUsers);

    // Broadcast user online status
    socket.broadcast.emit("userStatus", {
      userId: socket.userId,
      status: "online",
    });

    // forwards the received message to the specified user and to the room of sender
    socket.on("sendMessage", ({ to, content, type }) => {
      if (type === "text") {
        socket.to(to).to(socket.userId).emit("newMessage", {
          from: socket.userId,
          content: content,
          to: to,
        });
      } else {
        // Handle file upload TODO
      }
    });

    socket.on("typing", (data) => {
      socket.to(data.receiverId).emit("userTyping", { userId: socket.userId });
    });

    socket.on("stopTyping", (data) => {
      socket
        .to(data.receiverId)
        .emit("userStoppedTyping", { userId: socket.userId });
    });

    socket.on("disconnect", async () => {
      console.log(`User disconnected: ${socket.userId}`);

      const matchingSockets = await io.in(socket.userId).fetchSockets();
      const isDisconnected = matchingSockets.length === 0;

      if (isDisconnected) {
        // Broadcast user disconnected status
        socket.broadcast.emit("userStatus", {
          userId: socket.userId,
          status: "offline",
        });

        //save session
        await sessionStore.saveSession(socket.sessionId, {
          userId: socket.userId,
          connected: false,
        });
      }

      connectedUsers.filter((user) => user.userId != socket.userId);
    });
  });

  return { io, connectedUsers };
};
