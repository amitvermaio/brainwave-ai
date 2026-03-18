import { Router } from "express";
import authRoutes from './auth.route.js';
import documentRoutes from './document.route.js';
import quizRoutes from '../routes/quiz.route.js';
import aiRoutes from '../routes/ai.route.js';
import flashcardRoutes from '../routes/flashcard.route.js';
import progressRoutes from '../routes/progress.route.js';
const router = Router();

router.use('/auth', authRoutes);
router.use('/documents', documentRoutes);
router.use('/quiz', quizRoutes);
router.use('/ai', aiRoutes);
router.use('/flashcards', flashcardRoutes);
router.use('/progress', progressRoutes);

export default router;