import { createSlice } from "@reduxjs/toolkit";

const notificationSlice = createSlice({
  name: "notification",
  initialState: { message: null, status: "" },
  reducers: {
    successNotification(state, action) {
      return { message: action.payload, status: "success" };
    },
    errorNotification(state, action) {
      return { message: action.payload, status: "error" };
    },
    clearNotification(state, action) {
      return { message: null, status: "" };
    },
  },
});

export const { successNotification, errorNotification, clearNotification } =
  notificationSlice.actions;

export const displaySuccessNotification = (message, secs) => {
  return async (dispatch) => {
    dispatch(successNotification(message));
    setTimeout(() => {
      dispatch(clearNotification());
    }, secs * 1000);
  };
};

export const displayErrorNotification = (message, secs) => {
  return async (dispatch) => {
    dispatch(errorNotification(message));
    setTimeout(() => {
      dispatch(clearNotification());
    }, secs * 1000);
  };
};

export default notificationSlice.reducer;
