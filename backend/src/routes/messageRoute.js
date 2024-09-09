import express from "express";
import { messageController } from "../controllers/messageController.js";
import { authMiddleware } from "../middleware/auth.js";
import { uploadMiddleware } from "../middleware/upload.js";

export const messageRouter = express.Router();

messageRouter.get(
  "/:otherUserId",
  authMiddleware,
  messageController.getMessages
);
messageRouter.post(
  "/",
  authMiddleware,
  uploadMiddleware("file"),
  messageController.sendMessage
);
messageRouter.put(
  "/:messageId/read",
  authMiddleware,
  messageController.markAsRead
);
messageRouter.get("/last", authMiddleware, messageController.getLastMessages);
