import { http } from './client';
import {
  resolveEndpoint,
  type EndpointName,
  type EndpointPayloadMap,
  type EndpointResultMap,
} from './endpoints';
import type { ApiResponse, ApiResult } from './types';

export type CallOptions = {
  params?: Record<string, string | number | boolean | undefined>;
  headers?: Record<string, string>;
};

function extractMessage(body: unknown): string | undefined {
  if (body && typeof body === 'object' && 'message' in body) {
    const msg = (body as { message?: unknown }).message;
    return typeof msg === 'string' ? msg : undefined;
  }
  return undefined;
}

/**
 * Call any registered endpoint by name.
 * Returns `{ data, message }` — message comes from API when present.
 */
export async function apiCall<N extends EndpointName>(
  name: N,
  ...args: EndpointPayloadMap[N] extends void
    ? [payload?: undefined, options?: CallOptions]
    : [payload: EndpointPayloadMap[N], options?: CallOptions]
): Promise<ApiResult<EndpointResultMap[N]>> {
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

  // Envelope: { success, message, data }
  if (body && typeof body === 'object' && 'data' in body && 'success' in body) {
    const envelope = body as ApiResponse<EndpointResultMap[N]>;
    return {
      data: envelope.data,
      message: envelope.message ?? extractMessage(envelope.data),
    };
  }

  // Flat response: { message } or { accessToken, ... } etc.
  return {
    data: body as EndpointResultMap[N],
    message: extractMessage(body),
  };
}
