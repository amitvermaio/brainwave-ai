import { Router } from 'express';
import {
  generateFlashcards,
  generateQuiz,
  generateSummary,
  chat,
  explainConcept,
  getChatHistory,
} from '../controllers/ai.controller.js';
import authenticate from '../middlewares/auth.middleware.js';
import {
  generateLimiter,
  chatLimiter
} from '../middlewares/rateLimit.middleware.js';
import {
  generateFlashcardsRules,
  generateQuizRules,
  generateSummaryRules,
  chatRules,
  explainConceptRules,
  getChatHistoryRules,
} from '../validations/ai.validation.js';

const router = Router();

router.use(authenticate);

router.post('/generate-flashcards', generateLimiter, generateFlashcardsRules, generateFlashcards);
router.post('/generate-quiz', generateLimiter, generateQuizRules, generateQuiz);
router.post('/generate-summary', generateLimiter, generateSummaryRules, generateSummary);
router.post('/chat', chatLimiter, chatRules, chat);
router.post('/explain-concept', chatLimiter, explainConceptRules, explainConcept);
router.get('/chat-history/:documentId', getChatHistoryRules, getChatHistory);

export default router;