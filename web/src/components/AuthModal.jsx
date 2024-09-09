import React, { useState } from "react";

const AuthModal = ({ show, onLogin, onRegister }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isLogin) {
      onLogin({ email: email, password: password });
    } else {
      onRegister({ username: username, email: email, password: password });
    }
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-white overflow-y-auto h-full w-full flex items-center justify-center">
      <div className="bg-orange-500 p-8 rounded-lg shadow-xl w-96">
        <h2 className="text-2xl font-bold mb-4">
          {isLogin ? "Login" : "Register"}
        </h2>
        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-2 mb-4 border rounded bg-white text-black"
              required
            />
          )}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 mb-4 border rounded bg-white text-black"
            required
          />
          <input
            type="current-password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 mb-4 border rounded bg-white text-black"
            required
          />
          <button
            type="submit"
            className="w-full bg-orange-800 text-white p-2 rounded"
          >
            {isLogin ? "Login" : "Register"}
          </button>
        </form>
        <p className="mt-4 text-center">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button
            className="text-black bg-white"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? "Register" : "Login"}
          </button>
        </p>
      </div>
    </div>
  );
};

export default AuthModal;
