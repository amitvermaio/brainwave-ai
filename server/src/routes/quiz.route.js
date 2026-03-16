import { Router } from "express";
import { 
  getQuizzes,
  getQuizById,
  submitQuiz,
  getQuizResults,
  deleteQuiz  
} from "../controllers/quiz.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(authenticate);

router.get('/:documentId', getQuizzes);
router.get('/quiz/:quizId', getQuizById);
router.post('/:id/submit', submitQuiz);
router.get('/:id/results', getQuizResults);
router.delete('/:id/:quizId', deleteQuiz);

export default router;