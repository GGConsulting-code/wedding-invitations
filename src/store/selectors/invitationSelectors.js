export const selectInvitationsState = (state) => state.invitations;
export const selectInvitations = (state) => selectInvitationsState(state).items;
export const selectInvitationPagination = (state) =>
  selectInvitationsState(state).pagination;
export const selectInvitationFilters = (state) => selectInvitationsState(state).filters;
export const selectInvitationListStatus = (state) =>
  selectInvitationsState(state).listStatus;
export const selectInvitationListError = (state) =>
  selectInvitationsState(state).listError;
export const selectAttendanceSummary = (state) =>
  selectInvitationsState(state).attendance;
export const selectAttendanceStatus = (state) =>
  selectInvitationsState(state).attendanceStatus;
export const selectAttendanceError = (state) =>
  selectInvitationsState(state).attendanceError;
export const selectCreateInvitationStatus = (state) =>
  selectInvitationsState(state).createStatus;
export const selectCreateInvitationError = (state) =>
  selectInvitationsState(state).createError;
export const selectLastCreatedInvitation = (state) =>
  selectInvitationsState(state).lastCreated;
export const selectIsInvitationListLoading = (state) =>
  selectInvitationListStatus(state) === "loading";
export const selectIsCreatingInvitation = (state) =>
  selectCreateInvitationStatus(state) === "loading";

export const selectPublicInvitationState = (state) => state.publicInvitation;
export const selectPublicInvitation = (state) => selectPublicInvitationState(state).data;
export const selectPublicInvitationToken = (state) =>
  selectPublicInvitationState(state).publicToken;
export const selectPublicInvitationStatus = (state) =>
  selectPublicInvitationState(state).fetchStatus;
export const selectPublicInvitationError = (state) =>
  selectPublicInvitationState(state).fetchError;
export const selectRsvpStatus = (state) => selectPublicInvitationState(state).rsvpStatus;
export const selectRsvpError = (state) => selectPublicInvitationState(state).rsvpError;
export const selectLastRsvp = (state) => selectPublicInvitationState(state).lastRsvp;
