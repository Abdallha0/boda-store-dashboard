import axios from "axios";
import { handleError } from "../helpers/handleErrorMSG";
import { getTokenCookie } from "../helpers/cookies";

const url = import.meta.env.VITE_SERVER;

const api = axios.create({
  baseURL: url,
});

api.interceptors.request.use(
  (config) => {
    if (!navigator.onLine) {
      return Promise.reject(
        new Error("Network error please check your connection"),
      );
    }

    const token = getTokenCookie();
    if (token) {
      config.headers.Authorization = "Bearer " + token;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("app:online"));
    }
    return response;
  },
  (error) => {
    const isNetworkError =
      !navigator.onLine ||
      (axios.isAxiosError(error) &&
        (!error.response ||
          error.code === "ERR_NETWORK" ||
          error.code === "ECONNABORTED"));

    if (isNetworkError && typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("app:offline"));
      return Promise.reject(
        new Error("Network error please check your connection"),
      );
    }

    return Promise.reject(error);
  },
);

export default api;
