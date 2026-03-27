import { toast } from 'sonner';
import api from '../../config/axiosconfig';
import {
	setailoading,
	setaisummary,
	setaichat,
	setaichathistory,
	setaiexplanation,
	setaiflashcards,
	setaiquiz,
	setaierror,
} from '../reducers/aiSlice';

const extractdata = (responseData) => responseData?.data || responseData;

export const asyncgenerateflashcards = (payload) => async (dispatch) => {
	try {
		dispatch(setailoading());
		const { data } = await api.post('/ai/generate-flashcards', payload);
		dispatch(setaiflashcards(extractdata(data)));
		toast.success('Flashcards generated successfully');
		return true;
	} catch (error) {
		const message = error.response?.data?.message || 'Failed to generate flashcards';
		dispatch(setaierror(message));
		toast.error(message);
		return false;
	}
};

export const asyncgeneratequiz = (payload) => async (dispatch) => {
	try {
		dispatch(setailoading());
		const { data } = await api.post('/ai/generate-quiz', payload);
		dispatch(setaiquiz(extractdata(data)));
		toast.success('Quiz generated successfully');
		return true;
	} catch (error) {
		const message = error.response?.data?.message || 'Failed to generate quiz';
		dispatch(setaierror(message));
		toast.error(message);
		return false;
	}
};

export const asyncgeneratesummary = (payload) => async (dispatch) => {
	try {
		dispatch(setailoading());
		const { data } = await api.post('/ai/generate-summary', payload);
		const response = extractdata(data);
		dispatch(setaisummary(response));
		return response; // ✅ IMPORTANT
	} catch (error) {
		const message = error.response?.data?.message || 'Failed to generate summary';
		dispatch(setaierror(message));
		toast.error(message);
		return null;
	}
};

export const asyncexplainconcept = (payload) => async (dispatch) => {
	try {
		dispatch(setailoading());
		const { data } = await api.post('/ai/explain-concept', payload);
		const response = extractdata(data);
		dispatch(setaiexplanation(response));
		return response; // ✅ IMPORTANT
	} catch (error) {
		const message = error.response?.data?.message || 'Failed to explain concept';
		dispatch(setaierror(message));
		toast.error(message);
		return null;
	}
};

export const asyncchatwithdocument = (payload) => async (dispatch) => {
	try {
		dispatch(setailoading());
		const { data } = await api.post('/ai/chat', {
			documentId: payload.documentId,
			query: payload.message,
		});
		const response = extractdata(data);
		dispatch(setaichat(response ? [response] : []));
		return response?.answer || null;
	} catch (error) {
		const message = error.response?.data?.message || 'Failed to chat with document';
		dispatch(setaierror(message));
		toast.error(message);
		return null;
	}
};

export const asyncgetchathistory = (documentId) => async (dispatch) => {
	try {
		dispatch(setailoading());
		const { data } = await api.get(`/ai/chat-history/${documentId}`);
		dispatch(setaichathistory(extractdata(data) || []));
		return true;
	} catch (error) {
		const message = error.response?.data?.message || 'Failed to fetch chat history';
		dispatch(setaierror(message));
		toast.error(message);
		return false;
	}
};