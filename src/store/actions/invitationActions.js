import { createAsyncThunk } from "@reduxjs/toolkit";
import invitationService from "../../services/invitationService.js";
import { toRejectedValue } from "../../utils/apiError.js";

export const fetchAttendanceSummary = createAsyncThunk(
  "invitations/fetchAttendanceSummary",
  async (_, { rejectWithValue, signal }) => {
    try {
      return await invitationService.getAttendanceSummary({ signal });
    } catch (error) {
      return rejectWithValue(toRejectedValue(error));
    }
  },
);

export const fetchInvitations = createAsyncThunk(
  "invitations/fetchInvitations",
  async (params, { getState, rejectWithValue, signal }) => {
    try {
      const filters = params ?? getState().invitations?.filters ?? {};
      return await invitationService.listInvitations(filters, { signal });
    } catch (error) {
      return rejectWithValue(toRejectedValue(error));
    }
  },
);

export const createInvitation = createAsyncThunk(
  "invitations/createInvitation",
  async (invitation, { rejectWithValue, signal }) => {
    try {
      return await invitationService.createInvitation(invitation, { signal });
    } catch (error) {
      return rejectWithValue(toRejectedValue(error));
    }
  },
);
