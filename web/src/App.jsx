import React, { useState, useEffect, useCallback } from "react";
import Sidebar from "./components/Sidebar.jsx";
import ChatWindow from "./components/ChatWindow.jsx";
import AuthModal from "./components/AuthModal.jsx";
import apiService from "./services/api.js";
import ChatService from "./services/ChatService.js";

const App = () => {
  const [user, setUser] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [users, setUsers] = useState([]);
  const [chatUser, setChatUser] = useState(null);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      authenticateUser(token);
    } else {
      setShowAuthModal(true);
    }
  }, []);

  const handleOnlineUsers = useCallback((onlineUsers) => {
    console.log("handleOnlineUsers called with:", onlineUsers);
    setUsers((prevUsers) => {
      console.log("Previous users:", prevUsers);
      const updatedUsers = prevUsers.map((u) => ({
        ...u,
        isActive: onlineUsers.includes(u.id),
      }));
      console.log("Updated users:", updatedUsers);
      return updatedUsers;
    });
  }, []);

  const handleNewMessage = useCallback(
    (message) => {
      if (message.senderId === chatUser?.id) {
        setMessages((prevMessages) => [...prevMessages, message]);
      }
      updateLastMessage(message);
    },
    [chatUser]
  );

  const handleUserStatus = useCallback(({ userId, status }) => {
    setUsers((prevUsers) =>
      prevUsers.map((u) =>
        u.id === userId ? { ...u, isActive: status === "online" } : u
      )
    );
  }, []);

  const handleMessageRead = useCallback(({ messageId }) => {
    setMessages((prevMessages) =>
      prevMessages.map((msg) =>
        msg.id === messageId ? { ...msg, isRead: true } : msg
      )
    );
  }, []);

  const handleSendMessage = (content) => {
    if (chatUser) {
      ChatService.sendMessage(chatUser.id, content);
    }
  };

  const setupChatListeners = useCallback(() => {
    const listeners = [
      { event: "onlineUsers", handler: handleOnlineUsers },
      { event: "newMessage", handler: handleNewMessage },
      { event: "userStatus", handler: handleUserStatus },
      { event: "messageRead", handler: handleMessageRead },
    ];

    // listeners.forEach(({ event, handler }) => {
    //   ChatService.addListener(event, handler);
    // });

    // return () => {
    //   listeners.forEach(({ event, handler }) => {
    //     ChatService.removeListener(event, handler);
    //   });
    // };
  }, [
    handleOnlineUsers,
    handleNewMessage,
    handleUserStatus,
    handleMessageRead,
  ]);

  const fetchUsers = useCallback(async () => {
    try {
      const response = await apiService.getUsers();
      console.log("Fetched users:", response.data);
      setUsers(response.data);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    }
  }, []);

  useEffect(() => {
    if (user) {
      fetchUsers().then(() => {
        setupChatListeners();
      });
    }
    return () => {
      if (user) {
        ChatService.disconnect();
      }
    };
  }, [user, fetchUsers, setupChatListeners]);

  useEffect(() => {
    if (chatUser) {
      fetchMessages(chatUser.id);
    }
  }, [chatUser]);

  const authenticateUser = async (token) => {
    try {
      const response = await apiService.getCurrentUser();
      setUser(response.data);
      ChatService.connect(token);
    } catch (error) {
      console.error("Authentication failed:", error);
      setShowAuthModal(true);
    }
  };

  const handleAuth = async (action, data) => {
    try {
      const response = await apiService[action](data);
      localStorage.setItem("token", response.data.token);
      setUser(response.data.user);
      ChatService.connect(response.data.token);
      setShowAuthModal(false);
    } catch (error) {
      console.error(`${action} failed:`, error);
      // Handle auth error (show message to user)
    }
  };

  const fetchMessages = async (chatUserId) => {
    try {
      const response = await apiService.getMessages(chatUserId);
      setMessages(response.data);
    } catch (error) {
      console.error("Failed to fetch messages:", error);
    }
  };

  const handleFileUpload = async (file) => {
    if (currentConversation) {
      try {
        const uploadResponse = await apiService.uploadFile(file);
        ChatService.sendMessage(
          currentConversation.id,
          uploadResponse.data.fileUrl,
          file.type.startsWith("image/") ? "image" : "file"
        );
      } catch (error) {
        console.error("File upload failed:", error);
      }
    }
  };

  return (
    <div className="flex h-screen w-screen bg-white">
      {showAuthModal && (
        <AuthModal
          show={true}
          onLogin={(data) => handleAuth("login", data)}
          onRegister={(data) => handleAuth("register", data)}
        />
      )}
      {!showAuthModal && user && (
        <>
          <Sidebar
            users={users}
            currentUser={user}
            chatUser={chatUser}
            onUserSelect={setChatUser}
          />

          <ChatWindow
            currentUser={user}
            chatUser={chatUser}
            initialMessages={messages}
            onSendMessage={handleSendMessage}
            onFileUpload={handleFileUpload}
          />
        </>
      )}
    </div>
  );
};

export default App;
