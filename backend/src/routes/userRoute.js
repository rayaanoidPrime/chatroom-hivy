import express from "express";
import { userController } from "../controllers/userController.js";
import { authMiddleware } from "../middleware/auth.js";

export const userRouter = express.Router();

userRouter.get("/me", authMiddleware, userController.getCurrentUser);
userRouter.get("/", authMiddleware, userController.getAllUsers);
userRouter.get("/:id", authMiddleware, userController.getUserById);
