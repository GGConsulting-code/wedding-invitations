import { API_PATHS } from "../config/constants.js";
import { env } from "../config/env.js";
import {
  currentUserResponseSchema,
  emptySuccessResponseSchema,
  loginRequestSchema,
  loginResponseSchema,
} from "../schemas/apiSchemas.js";
import { parseEnvelope } from "./apiService.js";
import httpClient from "./httpClient.js";
import localBackend from "./localBackend.js";

export const login = async (credentials, { signal } = {}) => {
  const payload = loginRequestSchema.parse(credentials);

  if (env.dataMode === "local") {
    return localBackend.login(payload, { signal });
  }

  const response = await httpClient.post(API_PATHS.login, payload, {
    signal,
    requiresAuth: false,
  });
  return parseEnvelope(loginResponseSchema, response).data;
};

export const getCurrentUser = async ({ signal } = {}) => {
  if (env.dataMode === "local") {
    return localBackend.getCurrentUser({ signal });
  }

  const response = await httpClient.get(API_PATHS.currentUser, {
    signal,
    requiresAuth: true,
  });
  return parseEnvelope(currentUserResponseSchema, response).data.user;
};

export const logout = async ({ signal } = {}) => {
  if (env.dataMode === "local") {
    return localBackend.logout({ signal });
  }

  const response = await httpClient.post(API_PATHS.logout, undefined, {
    signal,
    requiresAuth: true,
    skipAuthFailureHandler: true,
  });
  return parseEnvelope(emptySuccessResponseSchema, response).data;
};

export const authService = { login, getCurrentUser, logout };
export default authService;
