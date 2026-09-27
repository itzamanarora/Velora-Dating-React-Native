/**
 * ─────────────────────────────────────────────
 *  YAHAN PE APNA API BASE URL LIKHO
 * ─────────────────────────────────────────────
 * Example: http://192.168.1.10:8080  (Android emulator: 10.0.2.2:8080)
 */
export const API_CONFIG = {
  /** Root server URL — no trailing slash */
  baseURL: "https://api.trivor.shop",

  /** All routes mount under this prefix */
  prefix: "/api/v1",

  timeout: 15000,
} as const;

export const apiRoot = `${API_CONFIG.baseURL}${API_CONFIG.prefix}`;
