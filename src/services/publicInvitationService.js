import { API_PATHS } from "../config/constants.js";
import { env } from "../config/env.js";
import {
  publicInvitationResponseSchema,
  rsvpRequestSchema,
  rsvpResponseSchema,
  uuidSchema,
} from "../schemas/apiSchemas.js";
import { parseEnvelope } from "./apiService.js";
import httpClient from "./httpClient.js";
import localBackend from "./localBackend.js";

const parsePublicToken = (publicToken) => uuidSchema.parse(publicToken);

export const getPublicInvitation = async (publicToken, { signal } = {}) => {
  const token = parsePublicToken(publicToken);

  if (env.dataMode === "local") {
    return localBackend.getPublicInvitation(token, { signal });
  }

  const response = await httpClient.get(API_PATHS.publicInvitation(token), {
    signal,
    requiresAuth: false,
  });
  return parseEnvelope(publicInvitationResponseSchema, response).data;
};

export const updateRsvp = async (publicToken, rsvp, { signal } = {}) => {
  const token = parsePublicToken(publicToken);
  const payload = rsvpRequestSchema.parse(rsvp);

  if (env.dataMode === "local") {
    return localBackend.updateRsvp(token, payload, { signal });
  }

  const response = await httpClient.put(
    API_PATHS.publicInvitationRsvp(token),
    payload,
    {
      signal,
      requiresAuth: false,
    },
  );
  return parseEnvelope(rsvpResponseSchema, response).data;
};

export const publicInvitationService = { getPublicInvitation, updateRsvp };
export default publicInvitationService;
