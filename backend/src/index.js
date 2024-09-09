import express from "express";
import http from "http";
import cors from "cors";
import { setupSocket } from "./config/socket.js";
import { handleError } from "./utils/errorHandler.js";
import { authRouter } from "./routes/authRoute.js";
import { userRouter } from "./routes/userRoute.js";
import { messageRouter } from "./routes/messageRoute.js";
import "dotenv/config";

const app = express();
const server = http.createServer(app);
const { io, connectedUsers } = setupSocket(server);

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Make io and connectedUsers available in the request
app.use((req, res, next) => {
  req.app.set("io", io);
  req.app.set("connectedUsers", connectedUsers);
  next();
});

// Routes
app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
app.use("/api/messages", messageRouter);

// Error handling middleware
app.use((err, req, res, next) => {
  handleError(err, res);
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;
