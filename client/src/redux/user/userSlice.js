import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentUser: null,
  loading: false,
  error: null,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    logInStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    logInSuccess: (state, action) => {
      state.currentUser = action.payload;
      state.loading = false;
      state.error = null;
    },
    logInFailture: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const { logInStart, logInSuccess, logInFailture } = userSlice.actions;

export default userSlice.reducer;
