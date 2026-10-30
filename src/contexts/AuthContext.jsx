import { createContext, useEffect, useState } from "react";
import { getAdmin, loginRequest, logoutRequest } from "../services/auth";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { isAbortError } from "../helpers/isAbortError";
import { toastStyles } from "../helpers/tones";

export const AuthContext = createContext();

const AUTH_STATUS = {
  LOADING: "loading",
  AUTHENTICATED: "authenticated",
  UNAUTHENTICATED: "unauthenticated",
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState(AUTH_STATUS.LOADING);

  useEffect(() => {
    const controller = new AbortController();
    const token = localStorage.getItem("token");

    if (!token) {
      setStatus(AUTH_STATUS.UNAUTHENTICATED);
      return;
    }

    getAdmin({ signal: controller.signal })
      .then((res) => {
        if (controller.signal.aborted) return;

        if (res.success) {
          setUser(res.user);
          setStatus(AUTH_STATUS.AUTHENTICATED);
        } else if (res.message === "Not authorized, token failed") {
          toast.error(res.message, {
            style: toastStyles.error,
          });
          localStorage.removeItem("token");
          setUser(null);
          setStatus(AUTH_STATUS.UNAUTHENTICATED);
        } else {
          setUser(null);
          toast.error(res.message, {
            style: toastStyles.error,
          });
        }
      })
      .catch((e) => {
        if (controller.signal.aborted || isAbortError(e)) return;

        setUser(null);
        setStatus(AUTH_STATUS.UNAUTHENTICATED);
      });

    return () => controller.abort();
  }, []);

  const login = async (email, password) => {
    const res = await loginRequest(email, password);
    const { token, ...data } = res;

    if (res.success) {
      localStorage.setItem("token", token);
      setUser(res.user);
      setStatus(AUTH_STATUS.AUTHENTICATED);
    }
    return data;
  };

  const logout = async () => {
    const res = await logoutRequest();
    localStorage.removeItem("token");
    setStatus(AUTH_STATUS.UNAUTHENTICATED);
    setUser(null);
    return res;
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, status }}>
      {children}
    </AuthContext.Provider>
  );
}
