import { eq } from "drizzle-orm";
import { db } from "../config/db.js";
import { users } from "../models.js";

export const userService = {
  async getAllUsers() {
    return await db.select().from(users);
  },

  async getUserById(id) {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  },

  async updateUserStatus(id, isOnline) {
    const [updatedUser] = await db
      .update(users)
      .set({ isOnline, lastSeen: new Date() })
      .where(eq(users.id, id))
      .returning();
    return updatedUser;
  },
};
