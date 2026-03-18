import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  dashboard: null,
  status: 'idle',
  error: null,
};

const progressSlice = createSlice({
  name: 'progress',
  initialState,
  reducers: {
    setprogressloading: (state) => {
      state.status = 'loading';
      state.error = null;
    },
    setdashboard: (state, action) => {
      state.status = 'succeeded';
      state.dashboard = action.payload || null;
    },
    setprogresserror: (state, action) => {
      state.status = 'failed';
      state.error = action.payload || null;
    },
  },
});

export const { setprogressloading, setdashboard, setprogresserror } = progressSlice.actions;

export default progressSlice.reducer;
