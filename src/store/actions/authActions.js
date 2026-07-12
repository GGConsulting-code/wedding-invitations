import { createAsyncThunk } from "@reduxjs/toolkit";
import authService from "../../services/authService.js";
import {
  clearAuthSession,
  readAuthSession,
  saveAuthSession,
  updateStoredUser,
} from "../../services/authSession.js";
import { toRejectedValue } from "../../utils/apiError.js";

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (credentials, { rejectWithValue, signal }) => {
    try {
      const authData = await authService.login(credentials, { signal });
      return saveAuthSession(authData);
    } catch (error) {
      clearAuthSession();
      return rejectWithValue(toRejectedValue(error));
    }
  },
);

export const restoreSession = createAsyncThunk("auth/restoreSession", async () =>
  readAuthSession(),
);

export const validateSession = createAsyncThunk(
  "auth/validateSession",
  async (_, { rejectWithValue, signal }) => {
    try {
      if (!readAuthSession()) {
        throw { code: "SESSION_NOT_FOUND", message: "No existe una sesión activa." };
      }
      const user = await authService.getCurrentUser({ signal });
      updateStoredUser(user);
      return user;
    } catch (error) {
      clearAuthSession();
      return rejectWithValue(toRejectedValue(error));
    }
  },
);

export const logoutUser = createAsyncThunk(
  "auth/logoutUser",
  async (_, { rejectWithValue, signal }) => {
    try {
      await authService.logout({ signal });
      clearAuthSession();
      return null;
    } catch (error) {
      clearAuthSession();
      return rejectWithValue(toRejectedValue(error));
    }
  },
);
