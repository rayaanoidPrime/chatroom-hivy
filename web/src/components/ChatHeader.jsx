import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import ChatService from "../services/ChatService";

const ChatHeader = ({ chatUser }) => {
  const [isTyping, setIsTyping] = useState(false);
  const [isActive, setIsActive] = useState(chatUser.isActive);

  useEffect(() => {
    const handleUserTyping = ({ userId }) => {
      if (userId === chatUser.id) {
        setIsTyping(true);
      }
    };

    const handleUserStoppedTyping = ({ userId }) => {
      if (userId === chatUser.id) {
        setIsTyping(false);
      }
    };

    const handleUserStatus = ({ userId, status }) => {
      if (userId === chatUser.id) {
        setIsActive(status === "online");
      }
    };

    ChatService.addListener("userTyping", handleUserTyping);
    ChatService.addListener("userStoppedTyping", handleUserStoppedTyping);
    ChatService.addListener("userStatus", handleUserStatus);

    return () => {
      ChatService.removeListener("userTyping", handleUserTyping);
      ChatService.removeListener("userStoppedTyping", handleUserStoppedTyping);
      ChatService.removeListener("userStatus", handleUserStatus);
    };
  }, [chatUser.id]);

  const getStatusDot = () => {
    if (isTyping) return "bg-yellow-400";
    return isActive ? "bg-green-400" : "bg-gray-400";
  };

  const getStatusText = () => {
    if (isTyping) return "Typing...";
    return isActive ? "Online" : "Offline";
  };

  return (
    <div className="flex items-center p-1.5 pl-5 border-b bg-gray-100">
      <img
        src={
          chatUser.profileImage
            ? chatUser.profileImage
            : "https://github.com/shadcn.png"
        }
        alt={`${chatUser.username} profile`}
        className="w-10 h-10 rounded-full mr-3"
      />
      <div className="flex-grow">
        <div className="font-bold text-lg text-black flex items-center">
          {chatUser.username}
          <span
            className={`w-2 h-2 rounded-full ${getStatusDot()} ml-2 mt-0.5`}
          ></span>
        </div>
        <div className="text-sm text-gray-600 ">{getStatusText()}</div>
      </div>
    </div>
  );
};

ChatHeader.propTypes = {
  chatUser: PropTypes.shape({
    id: PropTypes.number.isRequired,
    username: PropTypes.string.isRequired,
    profileImage: PropTypes.string,
    isActive: PropTypes.bool,
  }).isRequired,
};

export default ChatHeader;
