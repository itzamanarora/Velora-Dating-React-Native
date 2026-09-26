import axios, { type AxiosError } from "axios";
import { API_CONFIG } from "./config";
import { getAccessToken } from "./token";
import { ApiError, type ApiErrorBody } from "./types";

/**
 * Shared Axios client.
 * baseURL = config.baseURL + /api/v1
 */
export const http = axios.create({
  baseURL: `${API_CONFIG.baseURL}${API_CONFIG.prefix}`,
  timeout: API_CONFIG.timeout,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

http.interceptors.request.use((config) => {
  const skipAuth = Boolean(config.headers?.["X-Skip-Auth"]);

  if (skipAuth && config.headers) {
    delete config.headers["X-Skip-Auth"];
  }

  const token = getAccessToken();

  if (token && !skipAuth && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  console.log(
    "========== VELORA API REQUEST ==========\n" +
      `METHOD: ${config.method}\n` +
      `BASE URL: ${config.baseURL}\n` +
      `URL: ${config.url}\n` +
      `FULL URL: ${config.baseURL ?? ""}${config.url ?? ""}\n` +
      `TIMEOUT: ${config.timeout}\n` +
      "========================================",
  );

  return config;
});

http.interceptors.response.use(
  (response) => {
    console.log(
      "========== VELORA API RESPONSE ==========\n" +
        `STATUS: ${response.status}\n` +
        `URL: ${response.config.baseURL ?? ""}${response.config.url ?? ""}\n` +
        "=========================================",
    );

    return response;
  },

  (error: AxiosError<ApiErrorBody>) => {
    console.log(
      "========== VELORA API ERROR ==========\n" +
        `MESSAGE: ${error.message}\n` +
        `CODE: ${error.code}\n` +
        `BASE URL: ${error.config?.baseURL}\n` +
        `URL: ${error.config?.url}\n` +
        `FULL URL: ${error.config?.baseURL ?? ""}${error.config?.url ?? ""}\n` +
        `STATUS: ${error.response?.status ?? "NO HTTP RESPONSE"}\n` +
        `RESPONSE: ${JSON.stringify(error.response?.data ?? null)}\n` +
        `REQUEST EXISTS: ${!!error.request}\n` +
        "======================================",
    );

    const status = error.response?.status ?? 0;
    const body = error.response?.data;

    const message =
      body?.message ||
      error.message ||
      "Something went wrong. Please try again.";

    return Promise.reject(new ApiError(message, status, body));
  },
);
