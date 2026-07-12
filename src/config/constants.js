export const API_PREFIX = "/api/v1";

export const API_PATHS = Object.freeze({
  login: `${API_PREFIX}/auth/login`,
  currentUser: `${API_PREFIX}/auth/me`,
  logout: `${API_PREFIX}/auth/logout`,
  weddingConfig: `${API_PREFIX}/admin/wedding-config`,
  attendanceSummary: `${API_PREFIX}/admin/dashboard/attendance`,
  invitations: `${API_PREFIX}/admin/invitations`,
  publicInvitation: (publicToken) =>
    `${API_PREFIX}/public/invitations/${encodeURIComponent(publicToken)}`,
  publicInvitationRsvp: (publicToken) =>
    `${API_PREFIX}/public/invitations/${encodeURIComponent(publicToken)}/rsvp`,
});

export const SESSION_STORAGE_KEY = "wedding-admin-session";
export const LOCAL_DATABASE_STORAGE_KEY = "wedding-local-database-v2";

export const RSVP_STATUS = Object.freeze({
  PENDING: "PENDING",
  CONFIRMED: "CONFIRMED",
  DECLINED: "DECLINED",
});

export const INVITATION_CHANNEL = Object.freeze({
  WHATSAPP: "WHATSAPP",
  COPY_LINK: "COPY_LINK",
  OTHER: "OTHER",
});

export const ASYNC_STATUS = Object.freeze({
  IDLE: "idle",
  LOADING: "loading",
  SUCCEEDED: "succeeded",
  FAILED: "failed",
});

export const DEFAULT_INVITATION_QUERY = Object.freeze({
  page: 0,
  size: 20,
  sort: "createdAt,desc",
});
