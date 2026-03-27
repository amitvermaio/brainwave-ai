import Document from '../models/document.model.js';
import Flashcard from '../models/flashcard.model.js';
import Chat from '../models/chat.model.js';
import Quiz from '../models/quiz.model.js';
import AppError from '../utils/AppError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { getRelevantChunks, buildContext, runChain } from '../services/ai.service.js';

// @desc Generate Flashcard from document
export const generateFlashcards = async (req, res, next) => {
  try {
    const { documentId, count = 10 } = req.body;


    const document = await Document.findOne({
      _id: documentId,
      user: req.user.id,
      status: 'ready',
    });

    if (!document) {
      return next(new AppError('Document not found', 404));
    }


    const FLASHCARD_PROMPT = `
      You are an expert tutor. Based on the document content below, generate exactly {count} flashcards.
      Respond ONLY with a valid JSON array. No markdown, no explanation, no backticks.

      Format:
      [
        {{ "question": "...", "answer": "...", "difficulty": "easy" | "medium" | "hard" }},
        ...
      ]

      Document content:
      {context}
    `;

    const raw = await runChain(FLASHCARD_PROMPT, {
      count,
      context: document.extractedText.slice(0, 12000)
    });

    let cards;
    try {
      cards = JSON.parse(raw.replace(/```json|```/g, '').trim());
    } catch (error) {
      return next(new AppError('Failed to parse flashcards from AI response', 500));
    }

    const flashcardSet = await Flashcard.create({
      user: req.user.id,
      document: document._id,
      cards: cards.map(card => ({
        question: card.question,
        answer: card.answer,
        difficulty: card.difficulty || 'medium',
        reviewCount: 0,
        isStarred: false
      })),
    });

    document.flashcardCount = document.flashcardCount + 1;
    await document.save();

    res.status(201).json(new ApiResponse(
      201,
      flashcardSet,
      'Flashcards generated successfully'
    ))
  } catch (error) {
    next(error);
  }
}

// @desc Generate Quiz from document
export const generateQuiz = async (req, res, next) => {
  try {
    const { documentId, numQuestions = 5, title } = req.body;

    const document = await Document.findOne({
      _id: documentId,
      user: req.user.id,
      status: 'ready'
    });

    if (!document) {
      return next(new AppError('Document not found', 404));
    }

    const QUIZ_PROMPT = `
      You are an expert quiz maker. Based on the document content below, generate exactly {numQuestions} multiple choice questions.
      Respond ONLY with a valid JSON array. No markdown, no backticks, no explanation.

      Format:
      [
        {{
          "question": "...",
          "options": ["A. ...", "B. ...", "C. ...", "D. ..."],
          "correctAnswer": "A",
          "explanation": "..."
        }},
        ...
      ]

      Document content:
      {context}
    `;

    const raw = await runChain(QUIZ_PROMPT, {
      numQuestions,
      context: document.extractedText.slice(0, 12000)
    });

    let questions;
    try {
      questions = JSON.parse(raw.replace(/```json|```/g, '').trim());
    } catch (error) {
      return next(new AppError('Failed to parse quiz questions from AI response', 500));
    }

    const quiz = await Quiz.create({
      user: req.user.id,
      document: document._id,
      title: title || `${document.title} Quiz`,
      questions,
      totalQuestions: questions.length,
      userAnswers: [],
      score: 0
    });

    document.quizCount = document.quizCount + 1;
    await document.save();

    const quizToSend = questions.map((q, index) => ({
      questionId: index + 1,
      question: q.question,
      options: q.options
    }));

    res.status(201).json(new ApiResponse(
      201,
      { questions: quizToSend },
      'Quiz generated successfully'
    ));

  } catch (error) {
    next(error);
  }
}

// @desc Generate Summary from document
export const generateSummary = async (req, res, next) => {
  try {
    const { documentId } = req.body;

    const document = await Document.findById(documentId);
    if (!document) {
      return next(new AppError('Document not found', 404));
    }

    const SUMMARY_PROMPT = `
      You are an expert summarizer. Read the document below and produce a clear, structured summary.

      Include:
      - A 2-3 sentence overview
      - Key points (as a bullet list)
      - Main conclusions or takeaways

      Document:
      {context}
    `;

    const summary = await runChain(SUMMARY_PROMPT, {
      context: document.extractedText.slice(0, 15000)
    })

    res.status(200).json(new ApiResponse(
      200,
      { summary, documentId: document._id, title: document.title },
      'Summary generated successfully'
    ));
  } catch (error) {
    next(error);
  }
}

// @desc Chat with document
export const chat = async (req, res, next) => {
  try {
    const { documentId, query } = req.body;

    const document = await Document.findById(documentId);
    if (!document) {
      return next(new AppError('Document not found', 404));
    }

    let chatHistory = await Chat.findOne({
      user: req.user.id,
      document: document._id
    });

    if (!chatHistory) {
      chatHistory = await Chat.create({
        user: req.user.id,
        document: document._id,
        messages: []
      });
    }

    const chunks = await getRelevantChunks(req.user.id, document._id, query, 5);
    const context = buildContext(chunks);
    const chunkIndices = chunks.map(chunk => chunk.chunkIndex);

    const recentMessages = chatHistory.messages
      .slice(-6)
      .map(m => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`)
      .join('\n');

    const CHAT_PROMPT = `
      You are a helpful assistant answering questions about a specific document.
      Answer using ONLY the context provided. If the answer isn't in the context, say so honestly.

      Conversation so far:
      {history}

      Relevant document context:
      {context}

      User question: {query}

      Answer:
    `;

    const answer = await runChain(CHAT_PROMPT, {
      history: recentMessages || 'None',
      context,
      query
    });

    chatHistory.messages.push(
      {
        role: 'user',
        content: query,
        timestamp: new Date(),
        relevantChunks: chunkIndices
      },
      {
        role: 'assistant',
        content: answer,
        timestamp: new Date(),
        relevantChunks: chunkIndices
      }
    );

    await chatHistory.save();

    res.status(200).json(
      new ApiResponse(
        200,
        {
          question: query,
          answer,
          chatId: chatHistory._id,
          relevantChunks: chunkIndices
        },
        'Chat Response generated'
      )
    );
  } catch (error) {
    next(error);
  }
};

// @desc Explain concept from document
export const explainConcept = async (req, res, next) => {
  try {
    const { documentId, concept } = req.body;

    const document = await Document.findById({ _id: documentId, user: req.user.id, status: 'ready' });
    if (!document) {
      return next(new AppError('Document not found', 404));
    }

    const chunks = await getRelevantChunks(req.user.id, documentId, concept, 4);
    const context = buildContext(chunks);

    const EXPLAIN_PROMPT = `
      You are an expert teacher. Explain the concept "{concept}" using only the document context below.

      Your explanation should:
      - Define the concept clearly
      - Explain how it works or why it matters (based on the document)
      - Give an example if the document provides one
      - Be easy to understand for a student

      If the concept is not covered in the document, say so clearly.

      Document context:
      {context}
    `;

    const explanation = await runChain(EXPLAIN_PROMPT, {
      concept,
      context
    });

    res.status(200).json(new ApiResponse(
      200,
      { concept, explanation },
      'Concept explained successfully'
    ));

  } catch (error) {
    next(error);
  }
}

// @desc Get chat history for document
export const getChatHistory = async (req, res, next) => {
  try {
    const { documentId } = req.params;

    const chathistory = await Chat.findOne({ document: documentId, user: req.user.id });
    if (!chathistory) {
      return new ApiResponse(200, [], 'No chat history found');
    }

    res.status(200).json(new ApiResponse(
      200,
      chathistory.messages,
      'Chat history retrieved successfully'
    ));
  } catch (error) {
    next(error);
  }
}