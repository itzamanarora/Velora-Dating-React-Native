import { http } from './client';
import {
  resolveEndpoint,
  type EndpointName,
  type EndpointPayloadMap,
  type EndpointResultMap,
} from './endpoints';
import type { ApiResponse } from './types';

export type CallOptions = {
  /** Extra query params */
  params?: Record<string, string | number | boolean | undefined>;
  /** Override auth skip / force */
  headers?: Record<string, string>;
};

/**
 * Call any registered endpoint by name.
 *
 * @example
 * const data = await apiCall('auth.login', { email, password });
 * // data → { token, user, ... }
 *
 * @example
 * const profile = await apiCall('profile.get');
 */
export async function apiCall<N extends EndpointName>(
  name: N,
  ...args: EndpointPayloadMap[N] extends void
    ? [payload?: undefined, options?: CallOptions]
    : [payload: EndpointPayloadMap[N], options?: CallOptions]
): Promise<EndpointResultMap[N]> {
  const payload = args[0] as EndpointPayloadMap[N] | undefined;
  const options = args[1] as CallOptions | undefined;

  const { def, url } = resolveEndpoint(name);

  const headers: Record<string, string> = { ...(options?.headers ?? {}) };
  if (def.auth === false) {
    headers['X-Skip-Auth'] = '1';
  }

  const response = await http.request<ApiResponse<EndpointResultMap[N]> | EndpointResultMap[N]>({
    url,
    method: def.method,
    params: options?.params,
    headers,
    data: def.method === 'GET' ? undefined : payload ?? {},
  });

  const body = response.data;

  // Support both envelope `{ success, data }` and raw data responses
  if (body && typeof body === 'object' && 'data' in body && 'success' in body) {
    return (body as ApiResponse<EndpointResultMap[N]>).data;
  }

  return body as EndpointResultMap[N];
}
