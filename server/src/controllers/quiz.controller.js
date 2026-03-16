import Quiz from '../models/quiz.model.js';
import {ApiResponse} from '../utils/ApiResponse.js';
import AppError from '../utils/AppError.js';

// @desc Get All quizzes for a document
export const getQuizzes = async (req, res, next) => {
  try {
    const quizzes = await Quiz.find({
      user: req.user.id,
      documentId: req.params.documentId
    }).populate('documentId', 'title fileName').sort({ createdAt: -1 });
    
    res.status(200).json(new ApiResponse(200, quizzes, 'Quizzes fetched successfully'));
  } catch (error) {
    next(error);
  }
};

// @desc get a single quiz by id
export const getQuizById = async (req, res, next) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    res.status(200).json(new ApiResponse(200, quiz, 'Quiz fetched successfully'));
  } catch (error) {
    next(error);
  }
};

// @desc submit quiz answer
export const submitQuiz = async (req, res, next) => {
  try {
    const { answers } = req.body;
    if (!Array.isArray(answers) || answers.length === 0) {
      throw new AppError('Invalid answers format', 400);
    }
    
    const quiz = await Quiz.findOne({_id: req.params.id, user: req.user.id});
    if (!quiz) {
      throw new AppError('Quiz not found', 404);
    }

    if (quiz.completedAt) {
      throw new AppError('Quiz already completed', 400);
    }

    let correctedAnswers = 0;
    const userAnswers = [];

    answers.forEach(answer => {
      const {questionIndex, selectedAnswer} = answer;

      if (questionIndex < quiz.questions.length) {
        const question = quiz.questions[questionIndex];
        const isCorrect = question.correctAnswer === selectedAnswer;
        
        if (isCorrect) {
          correctedAnswers++;
        }
        
        userAnswers.push({
          questionIndex,
          selectedAnswer,
          isCorrect,
          answerAt: new Date()
        });
      }
    });

    const score = Math.round((correctedAnswers / quiz.questions.length) * 100);

    quiz.userAnswers = userAnswers;
    quiz.score = score;
    quiz.completedAt = new Date();
    await quiz.save();
    
    res.status(200).json(new ApiResponse(200, quiz, 'Quiz submitted successfully'));
  } catch (error) {
    next(error);
  }
};


// @desc get quiz results
export const getQuizResults = async (req, res, next) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    res.status(200).json(new ApiResponse(200, quiz, 'Quiz results fetched successfully'));
  } catch (error) {
    next(error);
  }
};


// @desc delete quiz
export const deleteQuiz = async (req, res, next) => {
  try {
    const quiz = await Quiz.findByIdAndDelete(req.params.id);
    res.status(200).json(new ApiResponse(200, quiz, 'Quiz deleted successfully'));
  } catch (error) {
    next(error);
  }
};


