import { createSlice } from '@reduxjs/toolkit';

const initialState = {
	quizzes: [],
	currentquiz: null,
	quizresult: null,
	status: 'idle',
	error: null,
};

const quizSlice = createSlice({
	name: 'quiz',
	initialState,
	reducers: {
		setquizloading: (state) => {
			state.status = 'loading';
			state.error = null;
		},
		setquizzes: (state, action) => {
			state.status = 'succeeded';
			state.quizzes = action.payload || [];
		},
		setcurrentquiz: (state, action) => {
			state.status = 'succeeded';
			state.currentquiz = action.payload || null;
		},
		setquizresult: (state, action) => {
			state.status = 'succeeded';
			state.quizresult = action.payload || null;
		},
		setquizerror: (state, action) => {
			state.status = 'failed';
			state.error = action.payload || null;
		},
	},
});

export const {
	setquizloading,
	setquizzes,
	setcurrentquiz,
	setquizresult,
	setquizerror,
} = quizSlice.actions;

export default quizSlice.reducer;
