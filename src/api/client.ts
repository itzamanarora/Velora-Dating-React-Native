import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";
import { API_CONFIG } from "./config";
import {
  clearTokens,
  getAccessToken,
  getRefreshToken,
  setTokens,
} from "./token";
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
    if (typeof config.headers.set === 'function') {
      config.headers.set('Authorization', `Bearer ${token}`);
    } else {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
  }

  console.log(
    "========== VELORA API REQUEST ==========\n" +
      `METHOD: ${config.method}\n` +
      `BASE URL: ${config.baseURL}\n` +
      `URL: ${config.url}\n` +
      `HEADERS: ${JSON.stringify(config.headers)}\n` +
      `PARAMS: ${JSON.stringify(config.params ?? {})}\n` +
      `FULL URL: ${config.baseURL ?? ""}${config.url ?? ""}\n` +
      `TIMEOUT: ${config.timeout}\n` +
      "========================================",
  );

  return config;
});

interface RetryAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (err: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token as string);
    }
  });
  failedQueue = [];
};

http.interceptors.response.use(
  (response) => {
    console.log(
      "========== VELORA API RESPONSE ==========\n" +
        `STATUS: ${response.status}\n` +
        `URL: ${response.config.baseURL ?? ""}${response.config.url ?? ""}\n` +
        `BODY: ${JSON.stringify(response.data ?? {})}\n` + // ← added
        "=========================================",
    );

    return response;
  },

  async (error: AxiosError<ApiErrorBody>) => {
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

    const originalRequest = error.config as RetryAxiosRequestConfig;
    const status = error.response?.status ?? 0;

    // Handle Token Refresh on 401
    if (status === 401 && originalRequest && !originalRequest._retry) {
      const refreshToken = getRefreshToken();

      // If we don't have a refresh token or we are hitting auth endpoints, just fail
      if (!refreshToken || originalRequest.url?.includes("/auth/")) {
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return http(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshUrl = `${API_CONFIG.baseURL}${API_CONFIG.prefix}/auth/refresh-token`;
        const response = await axios.post(refreshUrl, { refreshToken });

        // Handle both flat response or enveloped { data }
        const body = response.data;
        const tokens = body?.data ? body.data : body;
        
        const newAccessToken = tokens?.accessToken || tokens?.access_token || tokens?.token;
        const newRefreshToken = tokens?.refreshToken || tokens?.refresh_token;

        if (newAccessToken) {
          setTokens({
            accessToken: newAccessToken,
            refreshToken: newRefreshToken || refreshToken,
          });

          processQueue(null, newAccessToken);
          if (originalRequest.headers) {
            if (typeof originalRequest.headers.set === 'function') {
              originalRequest.headers.set('Authorization', `Bearer ${newAccessToken}`);
            } else {
              originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
            }
          }
          return http(originalRequest);
        } else {
          throw new Error("Invalid token response");
        }
      } catch (refreshError) {
        processQueue(refreshError, null);
        clearTokens();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    const body = error.response?.data;
    let message =
      body?.message ||
      error.message ||
      "Something went wrong. Please try again.";

    if (typeof message !== "string") {
      message = String(message);
    }

    return Promise.reject(new ApiError(message, status, body));
  },
);
