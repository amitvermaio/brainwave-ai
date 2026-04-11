import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  token: localStorage.getItem('token') ?? null,
  status: 'idle',
  error: null,
  isAuthenticated: false,
}

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setauthloading: (state) => {
      state.status = 'loading';
      state.error = null;
    },
    setauthsuccess: (state, action) => {
      state.user = action.payload?.user || action.payload || null;
      state.status = 'succeeded';
      state.error = null;
      state.isAuthenticated = true;
    },
    setautherror: (state, action) => {
      state.status = 'failed';
      state.error = action.payload || null;
    },
    clearuser: (state) => {
      state.user = null;
      state.token = null;
      state.status = 'idle';
      state.error = null;
      state.isAuthenticated = false;
    },
  }
});

export default authSlice.reducer;
export const { setautherror, setauthloading, setauthsuccess, clearuser } = authSlice.actions;