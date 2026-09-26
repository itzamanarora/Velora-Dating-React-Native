/**
 * Velora API layer
 *
 * 1. URL set karo → `src/api/config.ts`
 * 2. Endpoints add karo → `src/api/endpoints/<module>.ts`
 * 3. Page pe call karo:
 *
 *    import { api } from '@/api';
 *    const data = await api.call('auth.login', { email, password });
 */

import { apiCall } from './call';
import { API_CONFIG, apiRoot } from './config';
import { http } from './client';
import { modules, auth, profile } from './endpoints';
import { setAccessToken, getAccessToken, clearAccessToken } from './token';
import { ApiError } from './types';

export const api = {
  /** Dotted endpoint call: api.call('auth.login', payload) */
  call: apiCall,

  /** Raw axios instance if you ever need it */
  http,

  /** Config + modules for inspection */
  config: API_CONFIG,
  root: apiRoot,
  modules,
  endpoints: { auth, profile },

  /** Auth token helpers */
  setToken: setAccessToken,
  getToken: getAccessToken,
  clearToken: clearAccessToken,
} as const;

export { apiCall, ApiError, API_CONFIG, setAccessToken, getAccessToken, clearAccessToken };
export type {
  EndpointName,
  EndpointPayloadMap,
  EndpointResultMap,
} from './endpoints';
export type { AuthPayloads, AuthResults } from './endpoints/auth';
export type { Profile, ProfilePayloads, ProfileResults } from './endpoints/profile';
export type { ApiResponse, ApiErrorBody } from './types';

export default api;
