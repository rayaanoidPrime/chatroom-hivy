import io from "socket.io-client";

class ChatService {
  constructor() {
    this.connectedUsers = [];
    this.socket = null;
    this.selectedUser = null;
    this.sessionId = null;
  }

  connect(token) {
    const sessionId = localStorage.getItem("sessionId");
    this.socket = io(import.meta.env.VITE_BACKEND_URL, {
      auth: { token, sessionId },
    });

    this.socket.on("connect", () => {
      console.log("Connected to Socket id: " + this.socket.id);
      this.connectedUsers.forEach((user) => {
        //self user
        if (user.socketId === this.socket.id) {
          user.connected = true;
        }
      });
    });

    this.socket.on("disconnect", () => {
      console.log("Disconnected from WebSocket");
      this.connectedUsers.forEach((user) => {
        //self user
        if (user.socketId === this.socket.id) {
          user.connected = false;
        }
      });
    });

    this.socket.on("session", ({ sessionId, userId }) => {
      this.sessionId = sessionId;
      localStorage.setItem("sessionId", sessionId);
      this.socket.userId = userId;
    });

    this.socket.on("newMessage", ({ from, content }) => {
      this.connectedUsers.forEach((user) => {
        if (user.socketId === from) {
          user.messages.push({
            content,
            fromSelf: false,
          });
          if (user.socketId != this.selectedUser) {
            user.hasNewMessages = true;
          }
        }
      });
    });

    this.socket.on("userStatus", (data) => {
      if (data.status === "online") {
        this.connectedUsers.push({
          userId: data.userId,
          socketId: data.socketId,
        });
      } else {
        this.connectedUsers = this.connectedUsers.filter(
          (user) => user.userId !== data.userId
        );
      }
    });

    this.socket.on("connectedUsers", (users) => {
      this.connectedUsers = users;
    });

    this.socket.on("userTyping", (data) => {
      pass;
    });

    this.socket.on("userStoppedTyping", (data) => {
      pass;
    });
  }

  sendMessage(content, type = "text") {
    if (this.selectedUser) {
      this.socket.emit("sendMessage", {
        to: this.selectedUser.socketId,
        content,
        type,
      });
    }
    this.selectedUser.messages.push({
      content,
      fromSelf: true,
    });
  }

  markAsRead(messageId) {
    this.socket.emit("markAsRead", { messageId });
  }

  startTyping(receiverId) {
    this.socket.emit("typing", { receiverId });
  }

  stopTyping(receiverId) {
    this.socket.emit("stopTyping", { receiverId });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }
}

export default new ChatService();
