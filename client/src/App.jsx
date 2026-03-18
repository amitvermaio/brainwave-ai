import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import AuthWrapper from './components/auth/AuthWrapper';

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