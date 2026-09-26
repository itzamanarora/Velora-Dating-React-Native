import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios';
import { API_CONFIG } from './config';
import { ApiError, type ApiErrorBody } from './types';
import { getAccessToken } from './token';

/**
 * Shared Axios client.
 * baseURL = config.baseURL + /api/v1
 */
export const http = axios.create({
  baseURL: `${API_CONFIG.baseURL}${API_CONFIG.prefix}`,
  timeout: API_CONFIG.timeout,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

http.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const skipAuth = Boolean(config.headers?.['X-Skip-Auth']);
  if (skipAuth && config.headers) {
    delete config.headers['X-Skip-Auth'];
  }

  const token = getAccessToken();
  if (token && !skipAuth && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

http.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiErrorBody>) => {
    const status = error.response?.status ?? 0;
    const body = error.response?.data;
    const message =
      body?.message ||
      error.message ||
      'Something went wrong. Please try again.';

    return Promise.reject(new ApiError(message, status, body));
  },
);
