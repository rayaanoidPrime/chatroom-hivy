import axios from "axios";
import { config } from "../config";

const API_BASE_URL = config.backendUrl;

const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor to include the auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

const apiService = {
  // Auth
  login: ({ email, password }) => api.post("/auth/login", { email, password }),
  register: ({ username, email, password }) =>
    api.post("/auth/register", { username, email, password }),
  getCurrentUser: () => api.get("/users/me"),

  //users
  getUsers: () => api.get("/users"),

  //messages
  getMessages: (otherUserId) => api.get(`/messages/${otherUserId}`),
  sendMessage: (conversationId, content, type = "text") =>
    api.post(`/conversations/${conversationId}/messages`, { content, type }),

  // File upload
  uploadFile: (file) => {
    const formData = new FormData();
    formData.append("file", file);
    return api.post("/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
};

export default apiService;
