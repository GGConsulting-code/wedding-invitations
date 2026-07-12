import { createSlice, nanoid } from "@reduxjs/toolkit";

const uiSlice = createSlice({
  name: "ui",
  initialState: { notifications: [] },
  reducers: {
    addNotification: {
      reducer(state, action) {
        state.notifications.push(action.payload);
      },
      prepare(notification) {
        return { payload: { id: nanoid(), type: "info", ...notification } };
      },
    },
    removeNotification(state, action) {
      state.notifications = state.notifications.filter(({ id }) => id !== action.payload);
    },
    clearNotifications(state) {
      state.notifications = [];
    },
  },
});

export const { addNotification, clearNotifications, removeNotification } = uiSlice.actions;
export default uiSlice.reducer;
