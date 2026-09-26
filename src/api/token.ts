/** In-memory token store — swap for SecureStore later if needed */
let accessToken: string | null = null;
let refreshToken: string | null = null;

export function setTokens(tokens: {
  accessToken: string;
  refreshToken?: string | null;
} | null) {
  if (!tokens) {
    accessToken = null;
    refreshToken = null;
    return;
  }
  accessToken = tokens.accessToken;
  refreshToken = tokens.refreshToken ?? null;
}

export function setAccessToken(token: string | null) {
  accessToken = token;
}

export function getAccessToken() {
  return accessToken;
}

export function setRefreshToken(token: string | null) {
  refreshToken = token;
}

export function getRefreshToken() {
  return refreshToken;
}

export function clearAccessToken() {
  accessToken = null;
  refreshToken = null;
}

export function clearTokens() {
  clearAccessToken();
}
