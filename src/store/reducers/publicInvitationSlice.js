import { createSlice } from "@reduxjs/toolkit";
import { ASYNC_STATUS } from "../../config/constants.js";
import {
  fetchPublicInvitation,
  submitRsvp,
} from "../actions/publicInvitationActions.js";

export const initialPublicInvitationState = {
  publicToken: null,
  data: null,
  fetchStatus: ASYNC_STATUS.IDLE,
  fetchError: null,
  rsvpStatus: ASYNC_STATUS.IDLE,
  rsvpError: null,
  lastRsvp: null,
};

const publicInvitationSlice = createSlice({
  name: "publicInvitation",
  initialState: initialPublicInvitationState,
  reducers: {
    clearPublicInvitation(state) {
      Object.assign(state, initialPublicInvitationState);
    },
    clearRsvpError(state) {
      state.rsvpError = null;
      state.rsvpStatus = ASYNC_STATUS.IDLE;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPublicInvitation.pending, (state, action) => {
        state.publicToken =
          typeof action.meta.arg === "string"
            ? action.meta.arg
            : action.meta.arg?.publicToken ?? null;
        state.fetchStatus = ASYNC_STATUS.LOADING;
        state.fetchError = null;
        state.data = null;
      })
      .addCase(fetchPublicInvitation.fulfilled, (state, action) => {
        state.publicToken = action.payload.publicToken;
        state.data = action.payload.data;
        state.fetchStatus = ASYNC_STATUS.SUCCEEDED;
      })
      .addCase(fetchPublicInvitation.rejected, (state, action) => {
        state.fetchStatus = ASYNC_STATUS.FAILED;
        state.fetchError = action.payload ?? null;
      })
      .addCase(submitRsvp.pending, (state) => {
        state.rsvpStatus = ASYNC_STATUS.LOADING;
        state.rsvpError = null;
      })
      .addCase(submitRsvp.fulfilled, (state, action) => {
        state.rsvpStatus = ASYNC_STATUS.SUCCEEDED;
        state.lastRsvp = action.payload.data;
        if (state.data?.invitation) {
          state.data.invitation.status = action.payload.data.status;
        }
      })
      .addCase(submitRsvp.rejected, (state, action) => {
        state.rsvpStatus = ASYNC_STATUS.FAILED;
        state.rsvpError = action.payload ?? null;
      });
  },
});

export const { clearPublicInvitation, clearRsvpError } = publicInvitationSlice.actions;
export default publicInvitationSlice.reducer;
