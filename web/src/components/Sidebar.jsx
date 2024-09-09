import React, { useState, useMemo, useEffect } from "react";
import PropTypes from "prop-types";
import ChatService from "../services/ChatService";

const Sidebar = ({ users, currentUser, chatUser, onUserSelect }) => {
  const [filter, setFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredUsers = users.filter((user) => {
    return user.id !== currentUser.id; //exclude current user
  });

  // const filteredUsers = useMemo(() => {
  //   return localUsers.filter((user) => {
  //     if (user.id === currentUser.id) return false; // Exclude current user
  //     const matchesSearch =
  //       user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //       (user.lastMessage &&
  //         user.lastMessage.content
  //           .toLowerCase()
  //           .includes(searchTerm.toLowerCase()));
  //     const matchesFilter =
  //       filter === "All" ||
  //       (filter === "Unread" && user.unreadCount > 0) ||
  //       (filter === "Archived" && user.isArchived) ||
  //       (filter === "Blocked" && user.isBlocked);
  //     return matchesSearch && matchesFilter;
  //   });
  // }, [localUsers, searchTerm, filter, currentUser]);

  // const handleFilterChange = (newFilter) => {
  //   setFilter(newFilter);
  // };

  const getStatusDot = (user) => {
    if (user.isTyping) return "bg-yellow-400";
    return user.isActive ? "bg-green-400" : "bg-gray-400";
  };

  return (
    <div className="w-1/3 bg-white border-r flex flex-col">
      <div className="py-2 px-6 border-b border-gray-200 flex place-content-center">
        <input
          type="text"
          placeholder="Search"
          className="w-full px-4 py-2 rounded-md bg-gray-100 focus:outline-none border border-gray-300 text-black"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="flex gap-1.5 flex-wrap py-3 px-6 ">
        {["All", "Unread", "Archived", "Blocked"].map((filterOption) => (
          <button
            key={filterOption}
            className={`px-2 py-1 rounded-xl ${
              filterOption === filter
                ? "bg-orange-500 text-white"
                : "bg-transparent text-black"
            } text-xs border border-gray-300`}
            onClick={() => handleFilterChange(filterOption)}
          >
            {filterOption}
          </button>
        ))}
      </div>
      <div className="space-y-2 overflow-y-auto no-scrollbar">
        {filteredUsers.map((user) => (
          <div
            key={user.id}
            onClick={() => onUserSelect(user)}
            className={`cursor-pointer items-center px-1`}
          >
            <div
              className={`flex items-center p-4 gap-1 ${
                chatUser && chatUser.id === user.id
                  ? "bg-gray-100 border-l-4 border-orange-500"
                  : "hover:bg-gray-50 ml-1 "
              }`}
            >
              <img
                src={
                  user.profileImage
                    ? user.profileImage
                    : "https://github.com/shadcn.png"
                }
                alt={`${user.name} profile`}
                className="w-12 h-12 rounded-full mr-2"
              />
              <div className="flex-grow">
                <div className="flex flex-col font-semibold text-black items-start">
                  <div className="flex gap-3 items-center">
                    <div className="text-md leading-none">
                      {user.username ? user.username : user.email.split("@")[0]}
                    </div>
                    <span
                      className={`w-1.5 h-1.5 rounded-full mt-0.5 ${getStatusDot(
                        user
                      )} `}
                    ></span>
                  </div>
                  <div className="text-gray-400 text-xs">
                    {user.lastMessage && user.lastMessage.timestamp}
                  </div>
                </div>
                <div className={`text-gray-800 text-sm truncate`}>
                  {/* {user.lastMessage && (
                    <>
                      <span className="text-gray-500">
                        {user.username
                          ? user.username
                          : user.email.split("@")[0]}
                      </span>
                      {user.lastMessage.content}
                    </>
                  )} */}
                </div>
              </div>
              {/* {user.unreadCount > 0 && (
                <div className="bg-orange-500 text-white rounded-full px-2 py-1 text-xs">
                  {user.unreadCount}
                </div>
              )} */}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

Sidebar.propTypes = {
  users: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      username: PropTypes.string.isRequired,
      lastMessage: PropTypes.shape({
        content: PropTypes.string,
        timestamp: PropTypes.string,
      }),
      email: PropTypes.string.isRequired,
      // isOnline: PropTypes.bool.isRequired,
      // isTyping: PropTypes.bool,
      profileImage: PropTypes.string,
      // unreadCount: PropTypes.number,
      // isArchived: PropTypes.bool,
      // isBlocked: PropTypes.bool,
    })
  ).isRequired,
  currentUser: PropTypes.object.isRequired,
  onUserSelect: PropTypes.func.isRequired,
};

export default Sidebar;
