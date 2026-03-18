import { toast } from 'sonner';
import api from '../../config/axiosconfig';
import {
	setflashcardloading,
	setflashcardsets,
	setflashcards,
	setflashcarderror,
} from '../reducers/flashcardSlice';

const extractdata = (responseData) => responseData?.data || responseData;

export const asyncgetallflashcardsets = () => async (dispatch) => {
	try {
		dispatch(setflashcardloading());
		const { data } = await api.get('/flashcards');
		const response = extractdata(data);
		dispatch(setflashcardsets(response || []));
		return true;
	} catch (error) {
		const message = error.response?.data?.message || 'Failed to fetch flashcard sets';
		dispatch(setflashcarderror(message));
		toast.error(message);
		return false;
	}
};

export const asyncgetflashcards = (documentId) => async (dispatch) => {
	try {
		dispatch(setflashcardloading());
		const { data } = await api.get(`/flashcards/${documentId}`);
		const response = extractdata(data);
		dispatch(setflashcards(response || []));
		return true;
	} catch (error) {
		const message = error.response?.data?.message || 'Failed to fetch flashcards';
		dispatch(setflashcarderror(message));
		toast.error(message);
		return false;
	}
};

export const asyncreviewflashcard = (cardId) => async (dispatch) => {
	try {
		dispatch(setflashcardloading());
		const { data } = await api.post(`/flashcards/${cardId}/review`);
		const response = extractdata(data);
		dispatch(setflashcards(response?.cards || []));
		toast.success('Flashcard reviewed successfully');
		return true;
	} catch (error) {
		const message = error.response?.data?.message || 'Failed to review flashcard';
		dispatch(setflashcarderror(message));
		toast.error(message);
		return false;
	}
};

export const asynctogglestarflashcard = (cardId) => async (dispatch) => {
	try {
		dispatch(setflashcardloading());
		const { data } = await api.put(`/flashcards/${cardId}/star`);
		const response = extractdata(data);
		dispatch(setflashcards(response?.cards || []));
		toast.success('Flashcard updated successfully');
		return true;
	} catch (error) {
		const message = error.response?.data?.message || 'Failed to update flashcard';
		dispatch(setflashcarderror(message));
		toast.error(message);
		return false;
	}
};

export const asyncdeleteflashcardset = (id) => async (dispatch) => {
	try {
		dispatch(setflashcardloading());
		await api.delete(`/flashcards/${id}`);
		dispatch(asyncgetallflashcardsets());
		toast.success('Flashcard set deleted successfully');
		return true;
	} catch (error) {
		const message = error.response?.data?.message || 'Failed to delete flashcard set';
		dispatch(setflashcarderror(message));
		toast.error(message);
		return false;
	}
};
