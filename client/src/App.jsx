import React, { Suspense, lazy } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import AuthWrapper from './components/auth/AuthWrapper';
import UnauthWrapper from './components/auth/UnauthWrapper';

import { asyncloaduser } from './store/actions/authActions';
import { asyncgetdocuments } from './store/actions/documentActions';
import { asyncgetdashboard } from './store/actions/progressActions';

const Home = lazy(() => import('./pages/Home'));
const Login = lazy(() => import('./pages/auth/Login'));
const Register = lazy(() => import('./pages/auth/Register'));
const ForgotPassword = lazy(() => import('./pages/auth/ForgotPassword'));
const VerifyOtp = lazy(() => import('./pages/auth/VerifyOtp'))
const ResetPassword = lazy(() => import('./pages/auth/ResetPassword'));
const OAuthSuccess = lazy(() => import('./components/auth/OAuthSuccess'));

const Dashboard = lazy(() => import('./pages/dashboard/Dashboard'));
const DocumentList = lazy(() => import('./pages/documents/DocumentList'));
const DocumentDetails = lazy(() => import('./pages/documents/DocumentDetails'));
const FlashcardPage = lazy(() => import('./pages/flashcards/FlashcardPage'));

const FlashcardList = lazy(() => import('./pages/flashcards/FlashcardList'));
const Flashcard = lazy(() => import('./pages/flashcards/Flashcard'));

const QuizTake = lazy(() => import('./pages/quiz/QuizTake'));
const QuizResult = lazy(() => import('./pages/quiz/QuizResult'));

const Profile = lazy(() => import('./pages/profile/Profile'));
const NotFound = lazy(() => import('./pages/NotFound'));

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
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/" element={<Home />} />

          <Route element={<UnauthWrapper />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path='/verify-otp' element={<VerifyOtp />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
            <Route path='/oauth-success' element={<OAuthSuccess />} />
          </Route>

          <Route element={<AuthWrapper />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/documents" element={<DocumentList />} />
            <Route path="/documents/:id" element={<DocumentDetails />} />
            <Route path="/documents/:id/flashcards" element={<FlashcardPage />} />
            <Route path="/flashcards" element={<FlashcardList />} />
            <Route path="/flashcards/:id" element={<Flashcard />} />
            <Route path="/quiz/:quizId" element={<QuizTake />} />
            <Route path="/quiz/:quizId/results" element={<QuizResult />} />
            <Route path="/profile" element={<Profile />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </Router>
  )
}

export default App;