import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import ErrorFallback from "./components/ErrorFallback.jsx";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: App,
    errorElement: <ErrorFallback />, // TODO
    children: [
      {
        path: "/",
        lazy: () => import("./pages/Home"), // Home page skeleton
      },
      {
        path: "/auth",
        lazy: () => import(".features/auth/layouts/AuthFormLayout"), // Authh layout for the login and signup forms
        children: [
          { path: "login", lazy: () => import("./pages/Login") }, // login form
          { path: "signup", lazy: () => import("./pages/SignUp") }, // signup form
        ],
      },
      {
        path: "/chat",
        lazy: () => import(".features/chat/layouts/ChatLayout"), // Chat layout contains the sidebar and the chat window
        children: [
          { path: "", lazy: () => import("./pages/ChatHome") }, // User to choose a user to chat with
          { path: ":otherId", lazy: () => import("./pages/ChatDM") }, // DM window
        ],
      },
    ],
  },
]);

export default router;
