const runtimeEnv =
  typeof import.meta !== "undefined" && import.meta.env ? import.meta.env : {};

const readEnv = (name, fallback) => {
  const value = runtimeEnv[name];
  return value === undefined || value === "" ? fallback : value;
};

const parsePositiveInteger = (value, fallback) => {
  const parsed = Number.parseInt(String(value), 10);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
};

const trimTrailingSlashes = (value) => String(value).replace(/\/+$/, "");

const dataModeValue = String(readEnv("VITE_DATA_MODE", "local")).toLowerCase();

export const env = Object.freeze({
  dataMode: dataModeValue === "rest" ? "rest" : "local",
  apiBaseUrl: trimTrailingSlashes(
    readEnv("VITE_API_BASE_URL", "http://localhost:8080"),
  ),
  publicAppUrl: readEnv("VITE_PUBLIC_APP_URL", "auto"),
  httpTimeoutMs: parsePositiveInteger(
    readEnv("VITE_HTTP_TIMEOUT_MS", "15000"),
    15_000,
  ),
  defaultTimeZone: readEnv(
    "VITE_DEFAULT_TIME_ZONE",
    "America/Mexico_City",
  ),
});

export { parsePositiveInteger, readEnv, trimTrailingSlashes };
