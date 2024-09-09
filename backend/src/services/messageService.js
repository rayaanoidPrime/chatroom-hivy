import { eq, and, or, desc } from "drizzle-orm";
import { db } from "../config/db.js";
import { messages } from "../models.js";

export const messageService = {
  async getMessages(userId, otherUserId, lastMessageId = null, limit = 50) {
    let query = db
      .select()
      .from(messages)
      .where(
        or(
          and(
            eq(messages.senderId, userId),
            eq(messages.receiverId, otherUserId)
          ),
          and(
            eq(messages.senderId, otherUserId),
            eq(messages.receiverId, userId)
          )
        )
      )
      .orderBy(desc(messages.timestamp))
      .limit(limit);

    if (lastMessageId) {
      query = query.where(messages.id.lt(lastMessageId));
    }

    return await query;
  },

  async createMessage(
    senderId,
    receiverId,
    content,
    type = "text",
    fileUrl = null
  ) {
    const [newMessage] = await db
      .insert(messages)
      .values({
        senderId,
        receiverId,
        content,
        type,
        fileUrl,
      })
      .returning();
    return newMessage;
  },

  async markAsRead(messageId) {
    const [updatedMessage] = await db
      .update(messages)
      .set({ isRead: true })
      .where(eq(messages.id, messageId))
      .returning();
    return updatedMessage;
  },

  async getLastMessageForEachConversation(userId) {
    const subquery = db
      .select()
      .from(messages)
      .where(or(eq(messages.senderId, userId), eq(messages.receiverId, userId)))
      .groupBy(messages.senderId, messages.receiverId)
      .as("latest_messages");

    const result = await db
      .select()
      .from(messages)
      .innerJoin(
        subquery,
        and(
          or(
            and(
              eq(messages.senderId, subquery.senderId),
              eq(messages.receiverId, subquery.receiverId)
            ),
            and(
              eq(messages.senderId, subquery.receiverId),
              eq(messages.receiverId, subquery.senderId)
            )
          ),
          eq(messages.timestamp, subquery.maxTimestamp)
        )
      )
      .where(or(eq(messages.senderId, userId), eq(messages.receiverId, userId)))
      .orderBy(desc(messages.timestamp));

    return result;
  },
};
