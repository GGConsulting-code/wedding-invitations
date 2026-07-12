import axios from "axios";
import { env } from "../config/env.js";
import { normalizeApiError } from "../utils/apiError.js";
import { getAccessToken } from "./tokenStore.js";

let unauthorizedHandler = null;
let notifyingUnauthorized = false;

export const setUnauthorizedHandler = (handler) => {
  unauthorizedHandler = typeof handler === "function" ? handler : null;
  return () => {
    if (unauthorizedHandler === handler) unauthorizedHandler = null;
  };
};

const notifyUnauthorized = () => {
  if (!unauthorizedHandler || notifyingUnauthorized) return;
  notifyingUnauthorized = true;
  try {
    unauthorizedHandler();
  } finally {
    queueMicrotask(() => {
      notifyingUnauthorized = false;
    });
  }
};

export const httpClient = axios.create({
  baseURL: env.apiBaseUrl,
  timeout: env.httpTimeoutMs,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json; charset=utf-8",
  },
});

httpClient.interceptors.request.use((config) => {
  if (!config.requiresAuth) return config;
  const token = getAccessToken();
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

httpClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const config = error?.config || {};
    if (
      error?.response?.status === 401 &&
      config.requiresAuth &&
      !config.skipAuthFailureHandler
    ) {
      notifyUnauthorized();
    }
    return Promise.reject(normalizeApiError(error));
  },
);

export default httpClient;
