import { createSlice } from "@reduxjs/toolkit";
import {
  ASYNC_STATUS,
  DEFAULT_INVITATION_QUERY,
  RSVP_STATUS,
} from "../../config/constants.js";
import {
  createInvitation,
  fetchAttendanceSummary,
  fetchInvitations,
} from "../actions/invitationActions.js";

const initialPagination = {
  page: 0,
  size: 20,
  totalElements: 0,
  totalPages: 0,
  first: true,
  last: true,
};

export const initialInvitationsState = {
  items: [],
  pagination: initialPagination,
  filters: { ...DEFAULT_INVITATION_QUERY, status: "", search: "" },
  listStatus: ASYNC_STATUS.IDLE,
  listError: null,
  attendance: null,
  attendanceStatus: ASYNC_STATUS.IDLE,
  attendanceError: null,
  createStatus: ASYNC_STATUS.IDLE,
  createError: null,
  lastCreated: null,
};

const matchesCurrentFilters = (invitation, filters) => {
  const statusMatches = !filters.status || invitation.status === filters.status;
  const search = filters.search?.trim().toLocaleLowerCase("es-MX");
  const searchMatches =
    !search || invitation.recipientName.toLocaleLowerCase("es-MX").includes(search);
  return statusMatches && searchMatches;
};

const invitationsSlice = createSlice({
  name: "invitations",
  initialState: initialInvitationsState,
  reducers: {
    setInvitationFilters(state, action) {
      state.filters = { ...state.filters, ...action.payload };
    },
    resetInvitationFilters(state) {
      state.filters = { ...DEFAULT_INVITATION_QUERY, status: "", search: "" };
    },
    clearInvitationErrors(state) {
      state.listError = null;
      state.attendanceError = null;
      state.createError = null;
    },
    resetCreateInvitationStatus(state) {
      state.createStatus = ASYNC_STATUS.IDLE;
      state.createError = null;
      state.lastCreated = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAttendanceSummary.pending, (state) => {
        state.attendanceStatus = ASYNC_STATUS.LOADING;
        state.attendanceError = null;
      })
      .addCase(fetchAttendanceSummary.fulfilled, (state, action) => {
        state.attendance = action.payload;
        state.attendanceStatus = ASYNC_STATUS.SUCCEEDED;
      })
      .addCase(fetchAttendanceSummary.rejected, (state, action) => {
        state.attendanceStatus = ASYNC_STATUS.FAILED;
        state.attendanceError = action.payload ?? null;
      })
      .addCase(fetchInvitations.pending, (state, action) => {
        state.listStatus = ASYNC_STATUS.LOADING;
        state.listError = null;
        if (action.meta.arg) state.filters = { ...state.filters, ...action.meta.arg };
      })
      .addCase(fetchInvitations.fulfilled, (state, action) => {
        state.items = action.payload.items;
        state.pagination = action.payload.pagination;
        state.listStatus = ASYNC_STATUS.SUCCEEDED;
      })
      .addCase(fetchInvitations.rejected, (state, action) => {
        state.listStatus = ASYNC_STATUS.FAILED;
        state.listError = action.payload ?? null;
      })
      .addCase(createInvitation.pending, (state) => {
        state.createStatus = ASYNC_STATUS.LOADING;
        state.createError = null;
      })
      .addCase(createInvitation.fulfilled, (state, action) => {
        const created = action.payload;
        state.createStatus = ASYNC_STATUS.SUCCEEDED;
        state.lastCreated = created;
        if (
          state.pagination.page === 0 &&
          matchesCurrentFilters(created, state.filters) &&
          !state.items.some((item) => item.id === created.id)
        ) {
          state.items.unshift(created);
          state.items = state.items.slice(0, state.pagination.size || 20);
          state.pagination.totalElements += 1;
          state.pagination.totalPages = Math.ceil(
            state.pagination.totalElements / state.pagination.size,
          );
          state.pagination.last = state.pagination.totalPages <= 1;
        }
        if (state.attendance) {
          state.attendance.pending += 1;
          state.attendance.total += 1;
        }
      })
      .addCase(createInvitation.rejected, (state, action) => {
        state.createStatus = ASYNC_STATUS.FAILED;
        state.createError = action.payload ?? null;
      });
  },
});

export const {
  clearInvitationErrors,
  resetCreateInvitationStatus,
  resetInvitationFilters,
  setInvitationFilters,
} = invitationsSlice.actions;
export { RSVP_STATUS };
export default invitationsSlice.reducer;
