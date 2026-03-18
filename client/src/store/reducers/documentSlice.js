import { createSlice } from '@reduxjs/toolkit';

const initialState = {
	documents: [],
	currentdocument: null,
	status: 'idle',
	error: null,
};

const documentSlice = createSlice({
	name: 'document',
	initialState,
	reducers: {
		setdocumentloading: (state) => {
			state.status = 'loading';
			state.error = null;
		},
		setdocuments: (state, action) => {
			state.status = 'succeeded';
			state.documents = action.payload || [];
		},
		setcurrentdocument: (state, action) => {
			state.status = 'succeeded';
			state.currentdocument = action.payload || null;
		},
		setdocumenterror: (state, action) => {
			state.status = 'failed';
			state.error = action.payload || null;
		},
	},
});

export const {
	setdocumentloading,
	setdocuments,
	setcurrentdocument,
	setdocumenterror,
} = documentSlice.actions;

export default documentSlice.reducer;
