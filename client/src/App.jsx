import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import AuthWrapper from './components/auth/AuthWrapper';

import { asyncloaduser } from './store/actions/authActions';
import { asyncgetdocuments } from './store/actions/documentActions';
import { asyncgetdashboard } from './store/actions/progressActions';

import Home from './pages/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import Dashboard from './pages/dashboard/Dashboard';
import DocumentList from './pages/documents/DocumentList';
import DocumentDetails from './pages/documents/DocumentDetails';
import FlashcardList from './pages/flashcards/FlashcardList';
import Flashcard from './pages/flashcards/Flashcard';
import QuizTake from './pages/quiz/QuizTake';
import QuizResult from './pages/quiz/QuizResult';
import Profile from './pages/profile/Profile';
import NotFound from './pages/NotFound';

const App = () => {
  const dispatch = useDispatch();

  const { isAuthenticated, status: authStatus } = useSelector((state) => state.auth);
  const documentsStatus = useSelector((state) => state.document.status);
  const progressStatus = useSelector((state) => state.progress.status);

  React.useEffect(() => {
    const token = localStorage.getItem('token');
    if (token && !isAuthenticated && authStatus === 'idle') {
      dispatch(asyncloaduser());
    }
  }, [dispatch]);

  React.useEffect(() => {
    if (isAuthenticated && authStatus === 'succeeded' && progressStatus === 'idle') {
      dispatch(asyncgetdashboard());
    }
  }, [dispatch, isAuthenticated, authStatus, progressStatus]);

  React.useEffect(() => {
    if (isAuthenticated && authStatus === 'succeeded' && documentsStatus === 'idle') {
      dispatch(asyncgetdocuments());
    }
  }, [dispatch, isAuthenticated, authStatus, documentsStatus]);


  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        <Route element={<AuthWrapper />}>
          <Route path="/dashboard" element={<Dashboard />} />

          <Route path="/documents" element={<DocumentList />} />
          <Route path="/documents/:id" element={<DocumentDetails />} />
          
          <Route path="/flashcards" element={<FlashcardList />} />
          <Route path="/flashcards/:id" element={<Flashcard />} />
          
          <Route path="/quiz/:id" element={<QuizTake />} />
          <Route path="/quiz/:id/result" element={<QuizResult />} />
          
          <Route path="/profile" element={<Profile />} />
        </Route>


        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  )
}

export default App