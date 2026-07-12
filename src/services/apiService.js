import { normalizeApiError } from "../utils/apiError.js";

export const parseEnvelope = (schema, response) => {
  try {
    return schema.parse(response.data);
  } catch (error) {
    throw normalizeApiError(error);
  }
};

export const unwrapData = (schema, response) => parseEnvelope(schema, response).data;
