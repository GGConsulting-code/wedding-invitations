import {
  LOCAL_DATABASE_STORAGE_KEY,
  RSVP_STATUS,
} from "../config/constants.js";
import {
  LOCAL_ACCESS_TOKEN,
  LOCAL_ADMIN_CREDENTIALS,
  defaultInvitations,
  defaultWeddingConfig,
  localAdminUser,
} from "../data/defaultData.js";
import { LOCAL_MEDIA_PRESET_VERSION } from "../config/localMedia.js";
import { buildInvitationUrl } from "../utils/invitationUrl.js";
import { getAccessToken } from "./tokenStore.js";

const clone = (value) =>
  typeof structuredClone === "function"
    ? structuredClone(value)
    : JSON.parse(JSON.stringify(value));

const createUuid = () => {
  if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID();
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (character) => {
    const random = Math.floor(Math.random() * 16);
    const value = character === "x" ? random : (random & 0x3) | 0x8;
    return value.toString(16);
  });
};

const createInitialDatabase = () => ({
  mediaPresetVersion: LOCAL_MEDIA_PRESET_VERSION,
  weddingConfig: clone(defaultWeddingConfig),
  invitations: clone(defaultInvitations),
});

let memoryDatabase = createInitialDatabase();

const getStorage = () => {
  try {
    return typeof window !== "undefined" ? window.localStorage : null;
  } catch {
    return null;
  }
};

const loadDatabase = () => {
  const storage = getStorage();
  if (!storage) return memoryDatabase;

  try {
    const parsed = JSON.parse(storage.getItem(LOCAL_DATABASE_STORAGE_KEY) || "null");
    if (
      parsed &&
      parsed.weddingConfig &&
      Array.isArray(parsed.invitations)
    ) {
      if (parsed.mediaPresetVersion !== LOCAL_MEDIA_PRESET_VERSION) {
        parsed.weddingConfig.photos = clone(defaultWeddingConfig.photos);
        parsed.weddingConfig.audio = clone(defaultWeddingConfig.audio);
        parsed.mediaPresetVersion = LOCAL_MEDIA_PRESET_VERSION;
        storage.setItem(LOCAL_DATABASE_STORAGE_KEY, JSON.stringify(parsed));
      }
      memoryDatabase = parsed;
      return memoryDatabase;
    }
  } catch {
    // Si los datos locales están corruptos se reinician automáticamente.
  }

  memoryDatabase = createInitialDatabase();
  storage.setItem(LOCAL_DATABASE_STORAGE_KEY, JSON.stringify(memoryDatabase));
  return memoryDatabase;
};

const persistDatabase = (database) => {
  memoryDatabase = database;
  const storage = getStorage();
  if (storage) {
    storage.setItem(LOCAL_DATABASE_STORAGE_KEY, JSON.stringify(database));
  }
};

const mutateDatabase = (mutator) => {
  const database = loadDatabase();
  const result = mutator(database);
  persistDatabase(database);
  return result;
};

const createLocalError = (
  status,
  code,
  message,
  fieldErrors = {},
) => ({
  status,
  code,
  message,
  fieldErrors,
  traceId: createUuid(),
});

const abortError = () => {
  const error = new Error("La solicitud fue cancelada.");
  error.name = "AbortError";
  error.code = "REQUEST_ABORTED";
  return error;
};

const wait = (signal, milliseconds = 90) =>
  new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(abortError());
      return;
    }

    const timeout = setTimeout(() => {
      signal?.removeEventListener("abort", onAbort);
      resolve();
    }, milliseconds);

    function onAbort() {
      clearTimeout(timeout);
      reject(abortError());
    }

    signal?.addEventListener("abort", onAbort, { once: true });
  });

const requireAdminSession = () => {
  if (getAccessToken() !== LOCAL_ACCESS_TOKEN) {
    throw createLocalError(
      401,
      "UNAUTHORIZED",
      "La sesión no es válida. Inicia sesión nuevamente.",
    );
  }
};

const serializeInvitation = (record) => ({
  id: record.id,
  recipientName: record.recipientName,
  publicUrl: buildInvitationUrl(record.publicToken),
  status: record.status,
  channel: record.channel,
  createdAt: record.createdAt,
  respondedAt: record.respondedAt,
});

const buildPublicInvitation = (invitation, weddingConfig) => ({
  invitation: {
    recipientName: invitation.recipientName,
    status: invitation.status,
  },
  event: {
    coupleDisplayName: weddingConfig.coupleDisplayName,
    presentationText: weddingConfig.presentationText,
    weddingDateTime: weddingConfig.weddingDateTime,
    timeZone: weddingConfig.timeZone,
    address: clone(weddingConfig.address),
    photos: clone(weddingConfig.photos),
    audio: clone(weddingConfig.audio),
  },
});

const login = async (credentials, { signal } = {}) => {
  await wait(signal);

  if (
    credentials.username !== LOCAL_ADMIN_CREDENTIALS.username ||
    credentials.password !== LOCAL_ADMIN_CREDENTIALS.password
  ) {
    throw createLocalError(
      401,
      "INVALID_CREDENTIALS",
      "Usuario o contraseña incorrectos.",
    );
  }

  return {
    accessToken: LOCAL_ACCESS_TOKEN,
    tokenType: "Bearer",
    expiresIn: 8 * 60 * 60,
    user: clone(localAdminUser),
  };
};

const getCurrentUser = async ({ signal } = {}) => {
  await wait(signal, 50);
  requireAdminSession();
  return clone(localAdminUser);
};

const logout = async ({ signal } = {}) => {
  await wait(signal, 40);
  return {};
};

const getWeddingConfig = async ({ signal } = {}) => {
  await wait(signal);
  requireAdminSession();
  return clone(loadDatabase().weddingConfig);
};

const updateWeddingConfig = async (config, { signal } = {}) => {
  await wait(signal, 130);
  requireAdminSession();

  const current = loadDatabase().weddingConfig;
  if (Number(config.version) !== Number(current.version)) {
    throw createLocalError(
      409,
      "CONFIG_VERSION_CONFLICT",
      "La configuración cambió. Recarga los datos antes de guardar.",
    );
  }

  const updated = mutateDatabase((database) => {
    database.weddingConfig = {
      id: current.id,
      ...clone(config),
      version: current.version + 1,
      updatedAt: new Date().toISOString(),
    };
    return clone(database.weddingConfig);
  });

  return updated;
};

const getAttendanceSummary = async ({ signal } = {}) => {
  await wait(signal, 60);
  requireAdminSession();

  const invitations = loadDatabase().invitations.filter(
    (invitation) => invitation.active !== false,
  );

  return {
    confirmed: invitations.filter(
      (invitation) => invitation.status === RSVP_STATUS.CONFIRMED,
    ).length,
    declined: invitations.filter(
      (invitation) => invitation.status === RSVP_STATUS.DECLINED,
    ).length,
    pending: invitations.filter(
      (invitation) => invitation.status === RSVP_STATUS.PENDING,
    ).length,
    total: invitations.length,
  };
};

const listInvitations = async (params = {}, { signal } = {}) => {
  await wait(signal, 80);
  requireAdminSession();

  const page = Math.max(0, Number(params.page) || 0);
  const size = Math.min(100, Math.max(1, Number(params.size) || 20));
  const status = String(params.status || "").trim();
  const search = String(params.search || "").trim().toLocaleLowerCase("es-MX");
  const [sortField = "createdAt", sortDirection = "desc"] = String(
    params.sort || "createdAt,desc",
  ).split(",");

  const filtered = loadDatabase()
    .invitations.filter((invitation) => invitation.active !== false)
    .filter((invitation) => !status || invitation.status === status)
    .filter(
      (invitation) =>
        !search ||
        invitation.recipientName.toLocaleLowerCase("es-MX").includes(search),
    )
    .sort((left, right) => {
      const comparison = String(left[sortField] ?? "").localeCompare(
        String(right[sortField] ?? ""),
      );
      return sortDirection.toLowerCase() === "asc" ? comparison : -comparison;
    });

  const totalElements = filtered.length;
  const totalPages = Math.ceil(totalElements / size);
  const items = filtered
    .slice(page * size, page * size + size)
    .map(serializeInvitation);

  return {
    items,
    pagination: {
      page,
      size,
      totalElements,
      totalPages,
      first: page === 0,
      last: totalPages === 0 || page >= totalPages - 1,
    },
  };
};

const createInvitation = async (payload, { signal } = {}) => {
  await wait(signal, 130);
  requireAdminSession();

  const database = loadDatabase();
  const repeatedRequest = database.invitations.find(
    (invitation) => invitation.clientRequestId === payload.clientRequestId,
  );
  if (repeatedRequest) return serializeInvitation(repeatedRequest);

  const duplicatedToken = database.invitations.some(
    (invitation) => invitation.publicToken === payload.publicToken,
  );
  if (duplicatedToken) {
    throw createLocalError(
      409,
      "PUBLIC_TOKEN_CONFLICT",
      "El token público ya existe. Cierra el diálogo y genera otra invitación.",
    );
  }

  const created = mutateDatabase((mutableDatabase) => {
    const invitation = {
      id: createUuid(),
      recipientName: payload.recipientName.trim(),
      publicToken: payload.publicToken,
      clientRequestId: payload.clientRequestId,
      status: RSVP_STATUS.PENDING,
      channel: payload.channel,
      createdAt: new Date().toISOString(),
      respondedAt: null,
      active: true,
    };
    mutableDatabase.invitations.unshift(invitation);
    return clone(invitation);
  });

  return serializeInvitation(created);
};

const getPublicInvitation = async (publicToken, { signal } = {}) => {
  await wait(signal, 80);

  const database = loadDatabase();
  const invitation = database.invitations.find(
    (record) => record.publicToken === publicToken,
  );

  if (!invitation) {
    throw createLocalError(
      404,
      "INVITATION_NOT_FOUND",
      "La invitación no existe o el enlace está incompleto.",
    );
  }

  if (invitation.active === false) {
    throw createLocalError(
      410,
      "INVITATION_GONE",
      "La invitación ya no está disponible.",
    );
  }

  return buildPublicInvitation(invitation, database.weddingConfig);
};

const updateRsvp = async (publicToken, rsvp, { signal } = {}) => {
  await wait(signal, 110);

  const invitation = loadDatabase().invitations.find(
    (record) => record.publicToken === publicToken,
  );
  if (!invitation || invitation.active === false) {
    throw createLocalError(
      404,
      "INVITATION_NOT_FOUND",
      "La invitación no existe o ya no está disponible.",
    );
  }

  const result = mutateDatabase((database) => {
    const record = database.invitations.find(
      (item) => item.publicToken === publicToken,
    );
    record.status = rsvp.status;
    record.respondedAt = new Date().toISOString();
    return {
      status: record.status,
      respondedAt: record.respondedAt,
    };
  });

  return result;
};

const reset = () => {
  const database = createInitialDatabase();
  persistDatabase(database);
  return clone(database);
};

export const localBackend = {
  login,
  getCurrentUser,
  logout,
  getWeddingConfig,
  updateWeddingConfig,
  getAttendanceSummary,
  listInvitations,
  createInvitation,
  getPublicInvitation,
  updateRsvp,
  reset,
};

export default localBackend;
