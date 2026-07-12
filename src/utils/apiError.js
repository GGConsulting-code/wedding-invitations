const DEFAULT_ERROR_MESSAGE = "No fue posible completar la solicitud.";

const sanitizeFieldErrors = (errors) => {
  if (!Array.isArray(errors)) return [];
  return errors
    .filter((item) => item && typeof item === "object")
    .map((item) => ({
      field: typeof item.field === "string" ? item.field : null,
      code: typeof item.code === "string" ? item.code : "INVALID",
      message: typeof item.message === "string" ? item.message : DEFAULT_ERROR_MESSAGE,
    }));
};

const groupFieldErrors = (errors) =>
  errors.reduce((grouped, error) => {
    const field = error.field || "_global";
    grouped[field] ??= [];
    grouped[field].push(error.message);
    return grouped;
  }, {});

export const isAbortError = (error) =>
  error?.code === "ERR_CANCELED" ||
  error?.code === "REQUEST_ABORTED" ||
  error?.name === "AbortError" ||
  error?.message === "canceled";

export const normalizeApiError = (error) => {
  if (
    error &&
    Object.hasOwn(error, "status") &&
    Object.hasOwn(error, "code") &&
    Object.hasOwn(error, "fieldErrors") &&
    Object.hasOwn(error, "traceId")
  ) {
    return error;
  }

  const response = error?.response;
  const body = response?.data && typeof response.data === "object" ? response.data : {};
  const aborted = isAbortError(error);
  const validationIssues = Array.isArray(error?.issues)
    ? error.issues.map((issue) => ({
        field: Array.isArray(issue.path) ? issue.path.join(".") || null : null,
        code: issue.code || "INVALID_RESPONSE",
        message: issue.message || "La respuesta del servidor no cumple el contrato.",
      }))
    : [];

  return {
    status: Number.isInteger(response?.status)
      ? response.status
      : Number.isInteger(error?.status)
        ? error.status
        : null,
    code: aborted ? "REQUEST_ABORTED" : body.code || error?.code || "UNEXPECTED_ERROR",
    message: aborted
      ? "La solicitud fue cancelada."
      : typeof body.message === "string"
        ? body.message
        : error?.issues
          ? "La respuesta del servidor no cumple el contrato esperado."
          : error?.message || DEFAULT_ERROR_MESSAGE,
    fieldErrors: groupFieldErrors(
      validationIssues.length ? validationIssues : sanitizeFieldErrors(body.errors),
    ),
    traceId: typeof body.traceId === "string" ? body.traceId : null,
  };
};

export const getFieldError = (error, fieldName) =>
  error?.fieldErrors?.[fieldName]?.[0] ?? null;

export const toRejectedValue = (error) => {
  return normalizeApiError(error);
};
