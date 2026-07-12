import { createAsyncThunk } from "@reduxjs/toolkit";
import weddingConfigService from "../../services/weddingConfigService.js";
import { toRejectedValue } from "../../utils/apiError.js";

export const fetchWeddingConfig = createAsyncThunk(
  "weddingConfig/fetchWeddingConfig",
  async (_, { rejectWithValue, signal }) => {
    try {
      return await weddingConfigService.getWeddingConfig({ signal });
    } catch (error) {
      return rejectWithValue(toRejectedValue(error));
    }
  },
);

export const updateWeddingConfig = createAsyncThunk(
  "weddingConfig/updateWeddingConfig",
  async (config, { rejectWithValue, signal }) => {
    try {
      return await weddingConfigService.updateWeddingConfig(config, { signal });
    } catch (error) {
      return rejectWithValue(toRejectedValue(error));
    }
  },
);
