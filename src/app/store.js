import { configureStore } from "@reduxjs/toolkit";
import { clearAuthSession } from "../services/authSession.js";
import { setUnauthorizedHandler } from "../services/httpClient.js";
import { setAccessToken } from "../services/tokenStore.js";
import authReducer, { sessionExpired } from "../store/reducers/authSlice.js";
import invitationsReducer from "../store/reducers/invitationsSlice.js";
import publicInvitationReducer from "../store/reducers/publicInvitationSlice.js";
import uiReducer from "../store/reducers/uiSlice.js";
import weddingConfigReducer from "../store/reducers/weddingConfigSlice.js";

export const rootReducer = {
  auth: authReducer,
  weddingConfig: weddingConfigReducer,
  invitations: invitationsReducer,
  publicInvitation: publicInvitationReducer,
  ui: uiReducer,
};

export const createAppStore = (preloadedState) => {
  const appStore = configureStore({ reducer: rootReducer, preloadedState });

  if (preloadedState?.auth?.accessToken) {
    setAccessToken(preloadedState.auth.accessToken);
  }

  setUnauthorizedHandler(() => {
    clearAuthSession();
    appStore.dispatch(sessionExpired());
  });

  return appStore;
};

export const setupStore = createAppStore;
export const store = createAppStore();
export default store;
