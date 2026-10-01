import { createSlice } from "@reduxjs/toolkit";

const user = JSON.parse(localStorage.getItem("erp_user") || "null");

const slice = createSlice({
  name: "auth",
  initialState: { user, token: localStorage.getItem("erp_token") || null },
  reducers: {
    setCredentials: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      localStorage.setItem("erp_user", JSON.stringify(action.payload.user));
      localStorage.setItem("erp_token", action.payload.token);
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem("erp_user");
      localStorage.removeItem("erp_token");
    }
  }
});
export const { setCredentials, logout } = slice.actions;
export default slice.reducer;
