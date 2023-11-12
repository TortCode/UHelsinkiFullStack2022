import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: null,
  reducers: {
    setUser(state, action) {
      return action.payload;
    },
    clearUser(state, action) {
      return null;
    },
  },
});

export const initUserStorage = () => {
  return (dispatch) => {
    const loggedUserJSON = window.localStorage.getItem("loggedBlogAppUser");
    if (loggedUserJSON !== null) {
      const user = JSON.parse(loggedUserJSON);
      dispatch(setUser(user));
    }
  };
};

export const setUserStorage = (user) => {
  return (dispatch) => {
    window.localStorage.setItem("loggedBlogAppUser", JSON.stringify(user));
    dispatch(setUser(user));
  };
};

export const clearUserStorage = () => {
  return (dispatch) => {
    window.localStorage.removeItem("loggedBlogAppUser");
    dispatch(clearUser());
  };
};

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
