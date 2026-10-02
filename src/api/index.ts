/**
 * Velora API layer
 *
 * 1. URL set karo → `src/api/config.ts`
 * 2. Endpoints → `src/api/endpoints/<module>.ts`
 * 3. Page: const { data, message } = await api.call('auth.login', payload)
 */

import { apiCall } from './call';
import { API_CONFIG, apiRoot } from './config';
import { http } from './client';
import { modules, auth, profile, swipe } from './endpoints';
import {
  loadTokens,
  setAccessToken,
  getAccessToken,
  clearAccessToken,
  setTokens,
  getRefreshToken,
  clearTokens,
} from './token';
import { ApiError, apiToastMessage } from './types';

export const api = {
  call: apiCall,
  http,
  config: API_CONFIG,
  root: apiRoot,
  modules,
  endpoints: { auth, profile, swipe },

  loadTokens,
  setToken: setAccessToken,
  getToken: getAccessToken,
  clearToken: clearAccessToken,
  setTokens,
  getRefreshToken,
  clearTokens,
} as const;

export {
  apiCall,
  ApiError,
  API_CONFIG,
  loadTokens,
  setAccessToken,
  getAccessToken,
  clearAccessToken,
  setTokens,
  getRefreshToken,
  clearTokens,
  apiToastMessage,
};
export type {
  EndpointName,
  EndpointPayloadMap,
  EndpointResultMap,
} from './endpoints';
export type { AuthPayloads, AuthResults, AuthTokens } from './endpoints/auth';
export type {
  UserProfile,
  ProfilePayloads,
  ProfileResults,
  CreateProfilePayload,
  Gender,
  ProfileListParams,
  ProfileListResponse,
} from './endpoints/profile';
export type { ApiResponse, ApiErrorBody, ApiResult } from './types';

export default api;
