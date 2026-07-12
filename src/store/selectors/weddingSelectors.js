export const selectWeddingConfigState = (state) => state.weddingConfig;
export const selectWeddingConfig = (state) => selectWeddingConfigState(state).config;
export const selectWeddingConfigFetchStatus = (state) =>
  selectWeddingConfigState(state).fetchStatus;
export const selectWeddingConfigUpdateStatus = (state) =>
  selectWeddingConfigState(state).updateStatus;
export const selectWeddingConfigFetchError = (state) =>
  selectWeddingConfigState(state).fetchError;
export const selectWeddingConfigUpdateError = (state) =>
  selectWeddingConfigState(state).updateError;
export const selectIsWeddingConfigLoading = (state) =>
  selectWeddingConfigFetchStatus(state) === "loading";
export const selectIsWeddingConfigSaving = (state) =>
  selectWeddingConfigUpdateStatus(state) === "loading";
