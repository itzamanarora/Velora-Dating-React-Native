import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const ACCESS_TOKEN_KEY = 'velora_access_token';
const REFRESH_TOKEN_KEY = 'velora_refresh_token';

/**
 * Token store — in-memory cache + SecureStore persistence.
 * Synchronous reads from cache; async writes to SecureStore.
 */
let accessToken: string | null = null;
let refreshToken: string | null = null;

/** Persist a value to SecureStore (fire-and-forget) */
function persist(key: string, value: string | null) {
  if (Platform.OS === 'web') return; // SecureStore not available on web
  try {
    if (value) {
      SecureStore.setItemAsync(key, value);
    } else {
      SecureStore.deleteItemAsync(key);
    }
  } catch {
    // silently fail — in-memory cache still works
  }
}

/**
 * Load tokens from SecureStore into memory.
 * Call this once at app startup before rendering routes.
 */
export async function loadTokens(): Promise<void> {
  if (Platform.OS === 'web') return;
  try {
    const [storedAccess, storedRefresh] = await Promise.all([
      SecureStore.getItemAsync(ACCESS_TOKEN_KEY),
      SecureStore.getItemAsync(REFRESH_TOKEN_KEY),
    ]);
    accessToken = storedAccess;
    refreshToken = storedRefresh;
  } catch {
    // silently fail — tokens stay null
  }
}

export function setTokens(tokens: {
  accessToken: string;
  refreshToken?: string | null;
} | null) {
  if (!tokens) {
    accessToken = null;
    refreshToken = null;
    persist(ACCESS_TOKEN_KEY, null);
    persist(REFRESH_TOKEN_KEY, null);
    return;
  }
  accessToken = tokens.accessToken;
  refreshToken = tokens.refreshToken ?? null;
  persist(ACCESS_TOKEN_KEY, accessToken);
  persist(REFRESH_TOKEN_KEY, refreshToken);
}

export function setAccessToken(token: string | null) {
  accessToken = token;
  persist(ACCESS_TOKEN_KEY, token);
}

export function getAccessToken() {
  return accessToken;
}

export function setRefreshToken(token: string | null) {
  refreshToken = token;
  persist(REFRESH_TOKEN_KEY, token);
}

export function getRefreshToken() {
  return refreshToken;
}

export function clearAccessToken() {
  accessToken = null;
  refreshToken = null;
  persist(ACCESS_TOKEN_KEY, null);
  persist(REFRESH_TOKEN_KEY, null);
}

export function clearTokens() {
  clearAccessToken();
}
