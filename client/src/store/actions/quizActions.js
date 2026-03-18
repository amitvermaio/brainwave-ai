import { toast } from 'sonner';
import api from '../../config/axiosconfig';
import {
	setquizloading,
	setquizzes,
	setcurrentquiz,
	setquizresult,
	setquizerror,
} from '../reducers/quizSlice';

const extractdata = (responseData) => responseData?.data || responseData;

export const asyncgetquizzes = (documentId) => async (dispatch) => {
	try {
		dispatch(setquizloading());
		const { data } = await api.get(`/quiz/${documentId}`);
		dispatch(setquizzes(extractdata(data) || []));
		return true;
	} catch (error) {
		const message = error.response?.data?.message || 'Failed to fetch quizzes';
		dispatch(setquizerror(message));
		toast.error(message);
		return false;
	}
};

export const asyncgetquizbyid = (quizId) => async (dispatch) => {
	try {
		dispatch(setquizloading());
		const { data } = await api.get(`/quiz/quiz/${quizId}`);
		dispatch(setcurrentquiz(extractdata(data) || null));
		return true;
	} catch (error) {
		const message = error.response?.data?.message || 'Failed to fetch quiz';
		dispatch(setquizerror(message));
		toast.error(message);
		return false;
	}
};

export const asyncsubmitquiz = (id, answers) => async (dispatch) => {
	try {
		dispatch(setquizloading());
		const { data } = await api.post(`/quiz/${id}/submit`, { answers });
		dispatch(setquizresult(extractdata(data) || null));
		toast.success('Quiz submitted successfully');
		return true;
	} catch (error) {
		const message = error.response?.data?.message || 'Failed to submit quiz';
		dispatch(setquizerror(message));
		toast.error(message);
		return false;
	}
};

export const asyncgetquizresults = (id) => async (dispatch) => {
	try {
		dispatch(setquizloading());
		const { data } = await api.get(`/quiz/${id}/results`);
		dispatch(setquizresult(extractdata(data) || null));
		return true;
	} catch (error) {
		const message = error.response?.data?.message || 'Failed to fetch quiz results';
		dispatch(setquizerror(message));
		toast.error(message);
		return false;
	}
};

export const asyncdeletequiz = (id, quizId) => async (dispatch) => {
	try {
		dispatch(setquizloading());
		await api.delete(`/quiz/${id}/${quizId || id}`);
		dispatch(setcurrentquiz(null));
		toast.success('Quiz deleted successfully');
		return true;
	} catch (error) {
		const message = error.response?.data?.message || 'Failed to delete quiz';
		dispatch(setquizerror(message));
		toast.error(message);
		return false;
	}
};
