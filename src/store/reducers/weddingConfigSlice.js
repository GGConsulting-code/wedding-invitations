import { createSlice } from "@reduxjs/toolkit";
import { ASYNC_STATUS } from "../../config/constants.js";
import {
  fetchWeddingConfig,
  updateWeddingConfig,
} from "../actions/weddingConfigActions.js";

export const initialWeddingConfigState = {
  config: null,
  fetchStatus: ASYNC_STATUS.IDLE,
  updateStatus: ASYNC_STATUS.IDLE,
  fetchError: null,
  updateError: null,
};

const weddingConfigSlice = createSlice({
  name: "weddingConfig",
  initialState: initialWeddingConfigState,
  reducers: {
    clearWeddingConfigErrors(state) {
      state.fetchError = null;
      state.updateError = null;
    },
    resetWeddingConfigUpdateStatus(state) {
      state.updateStatus = ASYNC_STATUS.IDLE;
      state.updateError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWeddingConfig.pending, (state) => {
        state.fetchStatus = ASYNC_STATUS.LOADING;
        state.fetchError = null;
      })
      .addCase(fetchWeddingConfig.fulfilled, (state, action) => {
        state.config = action.payload;
        state.fetchStatus = ASYNC_STATUS.SUCCEEDED;
      })
      .addCase(fetchWeddingConfig.rejected, (state, action) => {
        state.fetchStatus = ASYNC_STATUS.FAILED;
        state.fetchError = action.payload ?? null;
      })
      .addCase(updateWeddingConfig.pending, (state) => {
        state.updateStatus = ASYNC_STATUS.LOADING;
        state.updateError = null;
      })
      .addCase(updateWeddingConfig.fulfilled, (state, action) => {
        state.config = action.payload;
        state.updateStatus = ASYNC_STATUS.SUCCEEDED;
      })
      .addCase(updateWeddingConfig.rejected, (state, action) => {
        state.updateStatus = ASYNC_STATUS.FAILED;
        state.updateError = action.payload ?? null;
      });
  },
});

export const { clearWeddingConfigErrors, resetWeddingConfigUpdateStatus } =
  weddingConfigSlice.actions;
export default weddingConfigSlice.reducer;
