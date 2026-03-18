import { createSlice } from '@reduxjs/toolkit';

const initialState = {
	summary: null,
	chatmessages: [],
	conceptexplanation: null,
	generatedflashcards: null,
	generatedquiz: null,
	chathistory: [],
	status: 'idle',
	error: null,
};

const aiSlice = createSlice({
	name: 'ai',
	initialState,
	reducers: {
		setailoading: (state) => {
			state.status = 'loading';
			state.error = null;
		},
		setaisummary: (state, action) => {
			state.status = 'succeeded';
			state.summary = action.payload || null;
		},
		setaichat: (state, action) => {
			state.status = 'succeeded';
			state.chatmessages = action.payload || [];
		},
		setaichathistory: (state, action) => {
			state.status = 'succeeded';
			state.chathistory = action.payload || [];
		},
		setaiexplanation: (state, action) => {
			state.status = 'succeeded';
			state.conceptexplanation = action.payload || null;
		},
		setaiflashcards: (state, action) => {
			state.status = 'succeeded';
			state.generatedflashcards = action.payload || null;
		},
		setaiquiz: (state, action) => {
			state.status = 'succeeded';
			state.generatedquiz = action.payload || null;
		},
		setaierror: (state, action) => {
			state.status = 'failed';
			state.error = action.payload || null;
		},
		clearaistate: () => initialState,
	},
});

export const {
	setailoading,
	setaisummary,
	setaichat,
	setaichathistory,
	setaiexplanation,
	setaiflashcards,
	setaiquiz,
	setaierror,
	clearaistate,
} = aiSlice.actions;

export default aiSlice.reducer;
