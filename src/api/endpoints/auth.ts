import type { EndpointDef } from "../types";

/**
 * Auth APIs — paths match backend Swagger exactly
 * (including the forget-passwod typo).
 */
export const auth = {
  /** POST /api/v1/auth/login */
  login: {
    method: "POST",
    path: "/login",
    auth: false,
  },
  /** POST /api/v1/auth/signup — register + send OTP */
  signup: {
    method: "POST",
    path: "/signup",
    auth: false,
  },
  /** POST /api/v1/auth/verify-otp */
  verifyOtp: {
    method: "POST",
    path: "/verify-otp",
    auth: false,
  },
  /** POST /api/v1/auth/resend-otp */
  resendOtp: {
    method: "POST",
    path: "/resend-otp",
    auth: false,
  },
  /** POST /api/v1/auth/forget-passwod (backend typo — keep as-is) */
  forgotPassword: {
    method: "POST",
    path: "/forgot-password",
    auth: false,
  },
  /** POST /api/v1/auth/reset-password */
  resetPassword: {
    method: "POST",
    path: "/reset-password",
    auth: false,
  },
  /** POST /api/v1/auth/refresh-token */
  refreshToken: {
    method: "POST",
    path: "/refresh-token",
    auth: false,
  },
  /** POST /api/v1/auth/signout */
  logout: {
    method: "POST",
    path: "/signout",
    auth: true,
  },
} as const satisfies Record<string, EndpointDef>;

export type AuthEndpoint = keyof typeof auth;

export type AuthTokens = {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
};

export type MessageResponse = {
  message: string;
};

export type AuthPayloads = {
  login: { email: string; password: string };
  signup: { email: string; password: string };
  verifyOtp: { email: string; otp: string };
  resendOtp: { email: string };
  forgotPassword: { email: string };
  resetPassword: { email: string; otp: string; newPassword: string };
  refreshToken: { refreshToken: string };
  logout: { refreshToken: string };
};

export type AuthResults = {
  login: AuthTokens;
  signup: { message: string; email: string };
  verifyOtp: MessageResponse;
  resendOtp: MessageResponse;
  forgotPassword: MessageResponse;
  resetPassword: MessageResponse;
  refreshToken: AuthTokens;
  logout: MessageResponse;
};
