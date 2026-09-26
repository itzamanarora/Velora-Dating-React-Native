import type { EndpointDef } from '../types';

/**
 * /api/v1/auth/*
 * Add new auth routes here — pages only pass the endpoint name.
 */
export const auth = {
  /** POST /api/v1/auth/login */
  login: {
    method: 'POST',
    path: '/login',
    auth: false,
  },
  /** POST /api/v1/auth/signup */
  signup: {
    method: 'POST',
    path: '/signup',
    auth: false,
  },
  /** POST /api/v1/auth/password-reset */
  passwordReset: {
    method: 'POST',
    path: '/password-reset',
    auth: false,
  },
  /** POST /api/v1/auth/password-reset/confirm */
  passwordResetConfirm: {
    method: 'POST',
    path: '/password-reset/confirm',
    auth: false,
  },
  /** POST /api/v1/auth/logout */
  logout: {
    method: 'POST',
    path: '/logout',
    auth: true,
  },
  /** POST /api/v1/auth/refresh */
  refresh: {
    method: 'POST',
    path: '/refresh',
    auth: false,
  },
} as const satisfies Record<string, EndpointDef>;

export type AuthEndpoint = keyof typeof auth;

/** Request / response shapes for auth endpoints */
export type AuthPayloads = {
  login: { email: string; password: string };
  signup: { name: string; email: string; password: string };
  passwordReset: { email: string };
  passwordResetConfirm: { token: string; password: string };
  logout: void;
  refresh: { refreshToken: string };
};

export type AuthResults = {
  login: {
    token: string;
    refreshToken?: string;
    user: { id: string; name: string; email: string };
  };
  signup: {
    token?: string;
    user: { id: string; name: string; email: string };
  };
  passwordReset: { sent: boolean };
  passwordResetConfirm: { reset: boolean };
  logout: { success: boolean };
  refresh: { token: string; refreshToken?: string };
};
