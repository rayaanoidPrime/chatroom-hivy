import { messageService } from "../services/messageService.js";

export const messageController = {
  async getMessages(req, res) {
    try {
      const { otherUserId } = req.params;
      const { lastMessageId } = req.query;
      const messages = await messageService.getMessages(
        req.user.id,
        otherUserId,
        lastMessageId
      );
      res.json(messages);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  async sendMessage(req, res) {
    try {
      const { receiverId, content, type } = req.body;
      const fileUrl = req.fileUrl || null;
      const message = await messageService.createMessage(
        req.user.id,
        receiverId,
        content,
        type || (fileUrl ? "file" : "text"),
        fileUrl
      );

      // Emit socket event for real-time message
      const io = req.app.get("io");
      const connectedUsers = req.app.get("connectedUsers");
      const receiverSocketId = connectedUsers.get(receiverId);

      if (receiverSocketId) {
        io.to(receiverSocketId).emit("newMessage", message);
      }

      res.status(201).json(message);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  async markAsRead(req, res) {
    try {
      const { messageId } = req.params;
      const updatedMessage = await messageService.markAsRead(messageId);

      // Emit socket event for message read status
      const io = req.app.get("io");
      const connectedUsers = req.app.get("connectedUsers");
      const senderSocketId = connectedUsers.get(updatedMessage.senderId);

      if (senderSocketId) {
        io.to(senderSocketId).emit("messageRead", { messageId });
      }

      res.json(updatedMessage);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  async getLastMessages(req, res) {
    try {
      const lastMessages =
        await messageService.getLastMessageForEachConversation(req.user.id);
      res.json(lastMessages);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};
