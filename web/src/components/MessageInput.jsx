import React, { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import ChatService from "../services/ChatService";

const MessageInput = ({ user, onSendMessage, onFileUpload }) => {
  const [message, setMessage] = useState("");
  const fileInputRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  const handleSend = () => {
    if (message.trim() !== "") {
      onSendMessage(message);
      setMessage("");
      ChatService.stopTyping(user.id);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleSend();
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      onFileUpload(file);
    }
  };

  const handleTyping = () => {
    ChatService.startTyping(user.id);

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      ChatService.stopTyping(user.id);
    }, 3000); // Stop typing after 3 seconds of inactivity
  };

  return (
    <div className="p-4 bg-white border-t">
      <div className="relative flex items-center">
        <input
          type="text"
          className="flex-grow border rounded-md px-4 py-2 pr-24 focus:outline-none bg-gray-100 text-black"
          placeholder="Type your message here"
          value={message}
          onChange={(e) => {
            setMessage(e.target.value);
            handleTyping();
          }}
          onKeyPress={handleKeyPress}
        />
        <div className="absolute right-2 flex items-center">
          <button
            className="text-orange-500 rounded-full p-2 bg-transparent hover:bg-gray-200"
            onClick={() => fileInputRef.current.click()}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
              />
            </svg>
          </button>
          <button
            className="ml-2 bg-transparent text-orange-500 rounded-full p-2 hover:bg-orange-600 hover:text-white"
            onClick={handleSend}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
              />
            </svg>
          </button>
        </div>
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="image/*,video/*"
          onChange={handleFileUpload}
        />
      </div>
    </div>
  );
};

MessageInput.propTypes = {
  onSendMessage: PropTypes.func.isRequired,
  onFileUpload: PropTypes.func.isRequired,
  user: PropTypes.shape({
    id: PropTypes.number.isRequired,
    username: PropTypes.string.isRequired,
  }).isRequired,
};

export default MessageInput;
