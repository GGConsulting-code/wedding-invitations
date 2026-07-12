import { createSlice } from "@reduxjs/toolkit";
import { ASYNC_STATUS } from "../../config/constants.js";
import {
  loginUser,
  logoutUser,
  restoreSession,
  validateSession,
} from "../actions/authActions.js";

export const initialAuthState = {
  accessToken: null,
  tokenType: null,
  expiresIn: null,
  expiresAt: null,
  user: null,
  status: ASYNC_STATUS.IDLE,
  validationStatus: ASYNC_STATUS.IDLE,
  logoutStatus: ASYNC_STATUS.IDLE,
  error: null,
  isRestored: false,
};

const clearCredentials = (state) => {
  state.accessToken = null;
  state.tokenType = null;
  state.expiresIn = null;
  state.expiresAt = null;
  state.user = null;
};

const applySession = (state, session) => {
  state.accessToken = session.accessToken;
  state.tokenType = session.tokenType;
  state.expiresIn = session.expiresIn;
  state.expiresAt = session.expiresAt;
  state.user = session.user;
};

const authSlice = createSlice({
  name: "auth",
  initialState: initialAuthState,
  reducers: {
    sessionExpired(state) {
      clearCredentials(state);
      state.status = ASYNC_STATUS.IDLE;
      state.validationStatus = ASYNC_STATUS.FAILED;
      state.error = {
        status: 401,
        code: "SESSION_EXPIRED",
        message: "Tu sesión expiró. Inicia sesión nuevamente.",
        fieldErrors: {},
        traceId: null,
      };
      state.isRestored = true;
    },
    clearAuthError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.status = ASYNC_STATUS.LOADING;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        applySession(state, action.payload);
        state.status = ASYNC_STATUS.SUCCEEDED;
        state.validationStatus = ASYNC_STATUS.SUCCEEDED;
        state.error = null;
        state.isRestored = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        clearCredentials(state);
        state.status = ASYNC_STATUS.FAILED;
        state.error = action.payload ?? null;
        state.isRestored = true;
      })
      .addCase(restoreSession.pending, (state) => {
        state.status = ASYNC_STATUS.LOADING;
      })
      .addCase(restoreSession.fulfilled, (state, action) => {
        if (action.payload) applySession(state, action.payload);
        else clearCredentials(state);
        state.status = ASYNC_STATUS.IDLE;
        state.error = null;
        state.isRestored = true;
      })
      .addCase(restoreSession.rejected, (state) => {
        clearCredentials(state);
        state.status = ASYNC_STATUS.FAILED;
        state.isRestored = true;
      })
      .addCase(validateSession.pending, (state) => {
        state.validationStatus = ASYNC_STATUS.LOADING;
        state.error = null;
      })
      .addCase(validateSession.fulfilled, (state, action) => {
        state.user = action.payload;
        state.validationStatus = ASYNC_STATUS.SUCCEEDED;
        state.error = null;
      })
      .addCase(validateSession.rejected, (state, action) => {
        clearCredentials(state);
        state.validationStatus = ASYNC_STATUS.FAILED;
        state.error = action.payload ?? null;
      })
      .addCase(logoutUser.pending, (state) => {
        state.logoutStatus = ASYNC_STATUS.LOADING;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        clearCredentials(state);
        state.logoutStatus = ASYNC_STATUS.SUCCEEDED;
        state.status = ASYNC_STATUS.IDLE;
        state.error = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        clearCredentials(state);
        state.logoutStatus = ASYNC_STATUS.FAILED;
        state.status = ASYNC_STATUS.IDLE;
        state.error = action.payload ?? null;
      });
  },
});

export const { clearAuthError, sessionExpired } = authSlice.actions;
export default authSlice.reducer;
