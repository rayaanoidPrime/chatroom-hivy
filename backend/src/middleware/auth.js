import jwt from "jsonwebtoken";
import { eq } from "drizzle-orm";
import { db } from "../config/db.js";
import { users } from "../models.js";

export const authMiddleware = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      throw new Error();
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, decoded.userId));

    if (!user) {
      throw new Error();
    }

    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    res.status(401).json({ message: "Please authenticate" });
  }
};
