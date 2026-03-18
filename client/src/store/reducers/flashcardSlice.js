import { createSlice } from '@reduxjs/toolkit';

const initialState = {
	flashcardsets: [],
	flashcards: [],
	status: 'idle',
	error: null,
};

const flashcardSlice = createSlice({
	name: 'flashcard',
	initialState,
	reducers: {
		setflashcardloading: (state) => {
			state.status = 'loading';
			state.error = null;
		},
		setflashcardsets: (state, action) => {
			state.status = 'succeeded';
			state.flashcardsets = action.payload || [];
		},
		setflashcards: (state, action) => {
			state.status = 'succeeded';
			state.flashcards = action.payload || [];
		},
		setflashcarderror: (state, action) => {
			state.status = 'failed';
			state.error = action.payload || null;
		},
	},
});

export const {
	setflashcardloading,
	setflashcardsets,
	setflashcards,
	setflashcarderror,
} = flashcardSlice.actions;

export default flashcardSlice.reducer;
