import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  token: localStorage.getItem('token') ?? null,
  pendingVerificationEmail: localStorage.getItem('pendingVerificationEmail') ?? null,
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
      const payload = action.payload;
      const hasExplicitUser = payload && typeof payload === 'object' && Object.prototype.hasOwnProperty.call(payload, 'user');
      const hasUserShape = payload && typeof payload === 'object' && Object.prototype.hasOwnProperty.call(payload, 'email');

      if (hasExplicitUser) {
        state.user = payload.user ?? null;
      } else if (hasUserShape) {
        state.user = payload;
      }

      state.token = payload?.token || state.token || localStorage.getItem('token') || null;
      state.pendingVerificationEmail = null;
      state.status = 'succeeded';
      state.error = null;
      state.isAuthenticated = Boolean(state.user && state.token);
    },
    setauthpendingverification: (state, action) => {
      state.user = null;
      state.token = null;
      state.pendingVerificationEmail = action.payload?.email || null;
      state.status = 'succeeded';
      state.error = null;
      state.isAuthenticated = false;
    },
    setautherror: (state, action) => {
      state.status = 'failed';
      state.error = action.payload || null;
    },
    clearuser: (state) => {
      state.user = null;
      state.token = null;
      state.pendingVerificationEmail = null;
      state.status = 'idle';
      state.error = null;
      state.isAuthenticated = false;
    },
  }
});

export default authSlice.reducer;
export const { setautherror, setauthloading, setauthsuccess, setauthpendingverification, clearuser } = authSlice.actions;