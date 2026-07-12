import { env } from "../config/env.js";

const resolveBaseUrl = (baseUrl = env.publicAppUrl) => {
  const configured = String(baseUrl ?? "").trim();

  if (!configured || configured.toLowerCase() === "auto") {
    if (typeof window !== "undefined" && window.location?.origin) {
      return window.location.origin;
    }
    return "http://127.0.0.1:3000";
  }

  return configured.replace(/\/+$/, "");
};

export const buildInvitationUrl = (publicToken, baseUrl = env.publicAppUrl) => {
  if (!publicToken || typeof publicToken !== "string") {
    throw new TypeError("Se requiere un token público válido.");
  }

  const normalizedBase = `${resolveBaseUrl(baseUrl)}/`;
  const url = new URL("invitacion", normalizedBase);
  url.search = new URLSearchParams({ token: publicToken }).toString();
  return url.toString();
};

export const getPublicTokenFromSearch = (search) => {
  const source =
    search ?? (typeof window !== "undefined" ? window.location.search : "");
  const token = new URLSearchParams(source).get("token");
  return token?.trim() || null;
};

export const normalizePublicAppUrl = (baseUrl = env.publicAppUrl) =>
  resolveBaseUrl(baseUrl);
