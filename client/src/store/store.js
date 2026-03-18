import { configureStore } from "@reduxjs/toolkit";
import authReducer from './reducers/authSlice';
import aiReducer from './reducers/aiSlice';
import documentReducer from './reducers/documentSlice';
import flashcardReducer from './reducers/flashcardSlice';
import quizReducer from './reducers/quizSlice';
import progressReducer from './reducers/progressSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    ai: aiReducer,
    document: documentReducer,
    flashcard: flashcardReducer,
    quiz: quizReducer,
    progress: progressReducer,
  }
});

export default store;