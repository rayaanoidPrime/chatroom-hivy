import { useEffect } from "react";
import { useAuth, useAuthSetter } from "./useAuth";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export const useAuthRedirect = () => {
  const { loginAsGuest } = useAuthSetter();
  const { auth, isLoading, error } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  if (error) {
    throw error;
  }

  useEffect(() => {
    if (isLoading) return;

    let navigateTo;

    if (location.pathname === "/") {
      if (!auth || auth.username === "Guest") {
        loginAsGuest();
        navigateTo = "/chat";
      } else {
        navigateTo = "/chat";
      }
    } else if (
      auth &&
      auth.username !== "Guest" &&
      AUTH_PATHS.includes(location.pathname)
    ) {
      navigateTo = "/chat";
    } else if (!auth || auth.username === "Guest") {
      loginAsGuest();
      navigateTo = "/chat";
    }

    if (navigateTo) {
      navigate(navigateTo, { replace: true });
    }
  }, [auth, location.pathname, isLoading, loginAsGuest, navigate]);

  return { isLoading };
};
