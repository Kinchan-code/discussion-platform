import axios from "axios";
import { API_URL } from "@/lib/constants";
import { useAuthStore } from "@/store/auth-store";

/**
 * Axios instance for the API
 * @description This is the axios instance for the API.
 *
 * Constants used:
 * - API_URL: The URL of the API.
 *
 * @returns {AxiosInstance} The axios instance.
 */
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Add auth token interceptor
 * @description This is the interceptor for the API.
 *
 * @param {AxiosRequestConfig} config The config for the API.
 * @returns {AxiosRequestConfig} The config for the API.
 */

api.interceptors.request.use((config) => {
  // Get token directly from store state (not using hook)
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
