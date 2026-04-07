import { toast } from 'sonner';
import api from '../../config/axiosconfig';
import {
  setquizloading,
  setquizzes,
  setcurrentquiz,
  setquizresult,
  removequiz,
  setquizerror,
} from '../reducers/quizSlice';

export const asyncgetquizzes = (documentId) => async (dispatch) => {
  try {
    dispatch(setquizloading());
    const { data } = await api.get(`/quiz/${documentId}`);
    const quizzes = data?.data ?? [];
    dispatch(setquizzes(quizzes));
    return quizzes;
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to fetch quizzes';
    dispatch(setquizerror(message));
    toast.error(message);
    return null;
  }
};

export const asyncgetquizbyid = (quizId) => async (dispatch) => {
  try {
    dispatch(setquizloading());
    const { data } = await api.get(`/quiz/by-id/${quizId}`);
    // Backend returns: { statusCode, data: quiz, message }
    // axios wraps in { data: ... } so data here = { statusCode, data: quiz, message }
    const quiz = data?.data ?? null;
    dispatch(setcurrentquiz(quiz));
    return quiz;
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to fetch quiz';
    dispatch(setquizerror(message));
    toast.error(message);
    return null;
  }
};

export const asyncsubmitquiz = (id, answers) => async (dispatch) => {
  try {
    dispatch(setquizloading());
    const { data } = await api.post(`/quiz/${id}/submit`, { answers });
    const result = data?.data ?? null;
    dispatch(setquizresult(result));
    toast.success('Quiz submitted successfully');
    return result;
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to submit quiz';
    dispatch(setquizerror(message));
    toast.error(message);
    return null;
  }
};

export const asyncgetquizresults = (id) => async (dispatch) => {
  try {
    dispatch(setquizloading());
    const { data } = await api.get(`/quiz/${id}/results`);
    // Backend returns: { statusCode, data: { quiz, results }, message }
    const result = data?.data ?? null;
    dispatch(setquizresult(result));
    return result;
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to fetch results';
    dispatch(setquizerror(message));
    toast.error(message);
    return null;
  }
};

export const asyncdeletequiz = (quizId) => async (dispatch) => {
  try {
    dispatch(setquizloading());
    await api.delete(`/quiz/${quizId}`);
    dispatch(removequiz(quizId));
    return true;
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to delete quiz';
    dispatch(setquizerror(message));
    toast.error(message);
    return false;
  }
};