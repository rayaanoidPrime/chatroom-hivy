const StatusIndicator = ({ isOnline, isTyping }) => {
  return (
    <div className="flex items-center p-2">
      <span
        className={`h-3 w-3 rounded-full ${
          isOnline ? "bg-green-500" : "bg-gray-500"
        }`}
      ></span>
      <span className="ml-2 text-sm text-gray-700">
        {isOnline ? "Online" : "Offline"}
      </span>
      {isTyping && (
        <span className="ml-4 text-sm text-blue-500">Typing...</span>
      )}
    </div>
  );
};

export default StatusIndicator;
