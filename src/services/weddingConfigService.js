import { API_PATHS } from "../config/constants.js";
import { env } from "../config/env.js";
import {
  weddingConfigResponseSchema,
  weddingConfigUpdateRequestSchema,
} from "../schemas/apiSchemas.js";
import { parseEnvelope } from "./apiService.js";
import httpClient from "./httpClient.js";
import localBackend from "./localBackend.js";

export const getWeddingConfig = async ({ signal } = {}) => {
  if (env.dataMode === "local") {
    return localBackend.getWeddingConfig({ signal });
  }

  const response = await httpClient.get(API_PATHS.weddingConfig, {
    signal,
    requiresAuth: true,
  });
  return parseEnvelope(weddingConfigResponseSchema, response).data;
};

export const updateWeddingConfig = async (config, { signal } = {}) => {
  const payload = weddingConfigUpdateRequestSchema.parse(config);

  if (env.dataMode === "local") {
    return localBackend.updateWeddingConfig(payload, { signal });
  }

  const response = await httpClient.put(API_PATHS.weddingConfig, payload, {
    signal,
    requiresAuth: true,
  });
  return parseEnvelope(weddingConfigResponseSchema, response).data;
};

export const weddingConfigService = { getWeddingConfig, updateWeddingConfig };
export default weddingConfigService;
