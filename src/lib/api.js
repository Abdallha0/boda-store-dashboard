import axios from "axios";
import { handleError } from "../helpers/handleErrorMSG";

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

    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = "Bearer " + token;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!navigator.onLine || (axios.isAxiosError(error) && !error.response)) {
      return Promise.reject(
        new Error(handleError(error).message || "Internal Server Error"),
      );
    }
    return Promise.reject(error);
  },
);

export default api;
