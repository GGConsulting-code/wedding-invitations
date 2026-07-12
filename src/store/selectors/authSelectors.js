export const selectAuth = (state) => state.auth;
export const selectAuthUser = (state) => selectAuth(state).user;
export const selectAccessToken = (state) => selectAuth(state).accessToken;
export const selectAuthStatus = (state) => selectAuth(state).status;
export const selectAuthValidationStatus = (state) => selectAuth(state).validationStatus;
export const selectAuthError = (state) => selectAuth(state).error;
export const selectSessionRestored = (state) => selectAuth(state).isRestored;
export const selectIsAuthenticated = (state) => {
  const auth = selectAuth(state);
  return Boolean(auth.accessToken && auth.user && (!auth.expiresAt || auth.expiresAt > Date.now()));
};
export const selectIsAdmin = (state) => selectAuthUser(state)?.roles?.includes("ADMIN") ?? false;
export const selectIsAuthLoading = (state) =>
  ["loading"].includes(selectAuthStatus(state)) ||
  ["loading"].includes(selectAuthValidationStatus(state));
