import React, { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import ChatService from "../services/ChatService";

const MessageList = ({ messages, currentUser, chatUser }) => {
  const messagesEndRef = useRef(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // useEffect(() => {
  //   const unreadMessages = messages.filter(
  //     (message) => !message.isOwn && !message.isRead
  //   );
  //   if (unreadMessages.length > 0) {
  //     unreadMessages.forEach((message) => {
  //       ChatService.markAsRead(currentUser.id, message.id);
  //     });
  //   }
  // }, [messages, currentUser.id]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const renderMessageContent = (message) => {
    if (message.type === "image") {
      return (
        <img
          src={message.content}
          alt="Uploaded"
          className="max-w-xs rounded-lg"
        />
      );
    } else if (message.type === "video") {
      return (
        <video controls className="max-w-xs rounded-lg">
          <source src={message.content} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      );
    } else {
      return <p>{message.content}</p>;
    }
  };

  return (
    <div className="flex-grow overflow-y-auto no-scrollbar p-4 space-y-4">
      {messages.map((message) => {
        const isOwnMessage = currentUser.id === message.senderId;
        return (
          <div
            key={message.id}
            className={`flex ${isOwnMessage ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-xs px-4 py-2 rounded-lg ${
                isOwnMessage
                  ? "bg-orange-500 text-white"
                  : "bg-gray-200 text-black"
              }`}
            >
              {renderMessageContent(message)}

              {isOwnMessage && (
                <span
                  className={`text-xs ${
                    message.isRead ? "text-blue-300" : "text-gray-300"
                  } mt-1 block`}
                >
                  {message.isRead ? "Read" : "Sent"}
                </span>
              )}
            </div>
          </div>
        );
      })}
      <div ref={messagesEndRef} />
    </div>
  );
};

MessageList.propTypes = {
  messages: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      content: PropTypes.string.isRequired,
      type: PropTypes.oneOf(["text", "image", "video"]).isRequired,
      timestamp: PropTypes.string.isRequired,
      isRead: PropTypes.bool,
    })
  ).isRequired,
  currentUser: PropTypes.shape({
    id: PropTypes.number.isRequired,
  }).isRequired,
};

export default MessageList;
