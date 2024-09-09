import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { eq } from "drizzle-orm";
import { db } from "../config/db.js";
import { users } from "../models.js";
import "dotenv/config";

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in environment variables");
}

export const authService = {
  async register(username, email, password) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const [newUser] = await db
      .insert(users)
      .values({
        username,
        email,
        password: hashedPassword,
      })
      .returning();
    return newUser;
  },

  async login(email, password) {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    if (!user) {
      throw new Error("User not found");
    }
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      throw new Error("Invalid password");
    }
    const token = jwt.sign(
      { userId: user.id, username: user.username },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );
    return { user, token };
  },
};
