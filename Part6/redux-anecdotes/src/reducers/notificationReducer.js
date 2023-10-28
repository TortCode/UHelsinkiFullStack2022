import { createSlice } from '@reduxjs/toolkit'

const initialState = 'Welcome to Anecdotes!';

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    changeNotification(state, action) {
      return action.payload;
    },
    clearNotification() {
      return initialState;
    }
  }
});

export const { changeNotification, clearNotification } = notificationSlice.actions;

export const setNotification = (message, secs) => {
  return async (dispatch) => {
    dispatch(changeNotification(message));
    setTimeout(() => {
      dispatch(clearNotification());
    }, secs * 1000);
  }
}
export default notificationSlice.reducer;