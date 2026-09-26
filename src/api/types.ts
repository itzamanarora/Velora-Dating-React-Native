export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export type EndpointDef = {
  method: HttpMethod;
  /** Path relative to module base, e.g. "/login" → /api/v1/auth/login */
  path: string;
  /** Skip Authorization header (login/signup) */
  auth?: boolean;
};

/** Standard API envelope — adjust if your backend shape differs */
export type ApiResponse<T = unknown> = {
  success: boolean;
  message?: string;
  data: T;
};

/** What `api.call` returns — data object + optional toast message */
export type ApiResult<T> = {
  data: T;
  message?: string;
};

export type ApiErrorBody = {
  success?: boolean;
  message?: string;
  errors?: Record<string, string[]>;
};

export class ApiError extends Error {
  status: number;
  body?: ApiErrorBody;

  constructor(message: string, status: number, body?: ApiErrorBody) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.body = body;
  }
}

/** Prefer API message; fallback when backend sends nothing */
export function apiToastMessage(message?: string | null) {
  return message?.trim() || 'Something went wrong';
}
