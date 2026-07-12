import { SESSION_STORAGE_KEY } from "../config/constants.js";
import { clearAccessToken, setAccessToken } from "./tokenStore.js";

const getSessionStorage = () => {
  try {
    return typeof window !== "undefined" ? window.sessionStorage : null;
  } catch {
    return null;
  }
};

export const createStoredSession = (authData, now = Date.now()) => ({
  accessToken: authData.accessToken,
  tokenType: authData.tokenType,
  expiresIn: authData.expiresIn,
  expiresAt: now + authData.expiresIn * 1000,
  user: authData.user,
});

export const saveAuthSession = (authData) => {
  const session = authData.expiresAt ? authData : createStoredSession(authData);
  setAccessToken(session.accessToken);
  const storage = getSessionStorage();
  if (storage) storage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
  return session;
};

export const readAuthSession = (now = Date.now()) => {
  const storage = getSessionStorage();
  if (!storage) return null;

  try {
    const session = JSON.parse(storage.getItem(SESSION_STORAGE_KEY) || "null");
    const isValid =
      typeof session?.accessToken === "string" &&
      session.accessToken.length >= 20 &&
      session.tokenType === "Bearer" &&
      Number.isFinite(session.expiresAt) &&
      session.expiresAt > now &&
      session.user &&
      typeof session.user === "object";

    if (!isValid) {
      storage.removeItem(SESSION_STORAGE_KEY);
      clearAccessToken();
      return null;
    }

    setAccessToken(session.accessToken);
    return session;
  } catch {
    storage.removeItem(SESSION_STORAGE_KEY);
    clearAccessToken();
    return null;
  }
};

export const updateStoredUser = (user) => {
  const session = readAuthSession();
  if (!session) return null;
  return saveAuthSession({ ...session, user });
};

export const clearAuthSession = () => {
  clearAccessToken();
  const storage = getSessionStorage();
  if (storage) storage.removeItem(SESSION_STORAGE_KEY);
};
