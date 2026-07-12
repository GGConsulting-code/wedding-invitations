import { API_PATHS, DEFAULT_INVITATION_QUERY } from "../config/constants.js";
import { env } from "../config/env.js";
import {
  attendanceSummaryResponseSchema,
  createInvitationRequestSchema,
  invitationListResponseSchema,
  invitationResponseSchema,
} from "../schemas/apiSchemas.js";
import { parseEnvelope } from "./apiService.js";
import httpClient from "./httpClient.js";
import localBackend from "./localBackend.js";

const compactParams = (params) =>
  Object.fromEntries(
    Object.entries(params).filter(
      ([, value]) => value !== undefined && value !== null && value !== "",
    ),
  );

export const getAttendanceSummary = async ({ signal } = {}) => {
  if (env.dataMode === "local") {
    return localBackend.getAttendanceSummary({ signal });
  }

  const response = await httpClient.get(API_PATHS.attendanceSummary, {
    signal,
    requiresAuth: true,
  });
  return parseEnvelope(attendanceSummaryResponseSchema, response).data;
};

export const listInvitations = async (params = {}, { signal } = {}) => {
  const query = { ...DEFAULT_INVITATION_QUERY, ...params };

  if (env.dataMode === "local") {
    return localBackend.listInvitations(query, { signal });
  }

  const response = await httpClient.get(API_PATHS.invitations, {
    signal,
    requiresAuth: true,
    params: compactParams(query),
  });
  const envelope = parseEnvelope(invitationListResponseSchema, response);
  return { items: envelope.data, pagination: envelope.meta.pagination };
};

export const createInvitation = async (invitation, { signal } = {}) => {
  const payload = createInvitationRequestSchema.parse(invitation);

  if (env.dataMode === "local") {
    return localBackend.createInvitation(payload, { signal });
  }

  const response = await httpClient.post(API_PATHS.invitations, payload, {
    signal,
    requiresAuth: true,
  });
  return parseEnvelope(invitationResponseSchema, response).data;
};

export const invitationService = {
  getAttendanceSummary,
  listInvitations,
  createInvitation,
};
export default invitationService;
