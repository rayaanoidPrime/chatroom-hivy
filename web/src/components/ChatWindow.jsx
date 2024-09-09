import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import ChatHeader from "./ChatHeader";

const ChatWindow = ({
  currentUser,
  chatUser,
  initialMessages,
  onSendMessage,
  onFileUpload,
}) => {
  const [messages, setMessages] = useState(initialMessages);

  // useEffect(() => {
  //   const handleNewMessage = (message) => {
  //     if (message.senderId === currentConversation.id) {
  //       setMessages((prevMessages) => [...prevMessages, message]);
  //     }
  //   };

  //   const handleMessageRead = ({ messageId }) => {
  //     setMessages((prevMessages) =>
  //       prevMessages.map((msg) =>
  //         msg.id === messageId ? { ...msg, isRead: true } : msg
  //       )
  //     );
  //   };

  //   ChatService.addListener("newMessage", handleNewMessage);
  //   ChatService.addListener("messageRead", handleMessageRead);

  //   return () => {
  //     ChatService.removeListener("newMessage", handleNewMessage);
  //     ChatService.removeListener("messageRead", handleMessageRead);
  //   };
  // }, [chatUser.id]);

  const handleSendMessage = (content) => {
    onSendMessage(content);
    // Optimistically add the message to the local state
    const newMessage = {
      id: Date.now(), // Temporary ID
      content,
      type: "text",
      senderId: currentUser.id,
      receiverId: chatUser.id,
      timestamp: new Date().toISOString(),
      // isOwn: true,
      isRead: false,
    };
    setMessages((prevMessages) => [...prevMessages, newMessage]);
  };

  if (!chatUser) {
    return (
      <div className="flex flex-col w-2/3 h-full bg-gray-200 justify-center items-center">
        <p className="text-gray-500 text-xl">
          Select a conversation to start chatting
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-2/3 h-full bg-white">
      <ChatHeader chatUser={chatUser} />
      <MessageList
        messages={messages}
        currentUser={currentUser}
        chatUser={chatUser}
      />
      <MessageInput
        user={currentUser}
        onSendMessage={handleSendMessage}
        onFileUpload={onFileUpload}
      />
    </div>
  );
};

ChatWindow.propTypes = {
  currentUser: PropTypes.shape({
    id: PropTypes.number.isRequired,
    username: PropTypes.string.isRequired,
  }).isRequired,
  chatUser: PropTypes.shape({
    id: PropTypes.number.isRequired,
    username: PropTypes.string.isRequired,
  }),
  initialMessages: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      content: PropTypes.string.isRequired,
      type: PropTypes.oneOf(["text", "image", "video"]).isRequired,
      senderId: PropTypes.number.isRequired,
      receiverId: PropTypes.number.isRequired,
      timestamp: PropTypes.string.isRequired,
      isOwn: PropTypes.bool,
      isRead: PropTypes.bool,
    })
  ).isRequired,
  onSendMessage: PropTypes.func.isRequired,
  onFileUpload: PropTypes.func.isRequired,
};

export default ChatWindow;
