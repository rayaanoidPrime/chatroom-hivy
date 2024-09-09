import {
  pgTable,
  serial,
  text,
  timestamp,
  boolean,
  integer,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  isOnline: boolean("is_online").default(false),
  lastSeen: timestamp("last_seen").defaultNow(),
});

export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  senderId: integer("sender_id").references(() => users.id),
  receiverId: integer("receiver_id").references(() => users.id),
  content: text("content").notNull(),
  timestamp: timestamp("timestamp").defaultNow(),
  isRead: boolean("is_read").default(false),
  type: text("type").default("text"), // 'text', 'image', or 'video'
  fileUrl: text("file_url"),
});
