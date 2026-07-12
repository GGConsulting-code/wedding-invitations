import { createAsyncThunk } from "@reduxjs/toolkit";
import publicInvitationService from "../../services/publicInvitationService.js";
import { toRejectedValue } from "../../utils/apiError.js";

const readToken = (value) => (typeof value === "string" ? value : value?.publicToken);

export const fetchPublicInvitation = createAsyncThunk(
  "publicInvitation/fetchPublicInvitation",
  async (argument, { rejectWithValue, signal }) => {
    const publicToken = readToken(argument);
    try {
      const data = await publicInvitationService.getPublicInvitation(publicToken, { signal });
      return { publicToken, data };
    } catch (error) {
      return rejectWithValue(toRejectedValue(error));
    }
  },
);

export const submitRsvp = createAsyncThunk(
  "publicInvitation/submitRsvp",
  async (argument, { rejectWithValue, signal }) => {
    const publicToken = readToken(argument);
    const payload = argument?.rsvp ?? {
      status: argument?.status,
      ...(Object.hasOwn(argument ?? {}, "respondedAtClient")
        ? { respondedAtClient: argument.respondedAtClient }
        : {}),
    };
    try {
      const data = await publicInvitationService.updateRsvp(publicToken, payload, { signal });
      return { publicToken, data };
    } catch (error) {
      return rejectWithValue(toRejectedValue(error));
    }
  },
);
