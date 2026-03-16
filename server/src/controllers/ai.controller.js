import Document from '../models/document.model.js';
import Flashcard from '../models/flashcard.model.js';
import Chat from '../models/chat.model.js';
import User from '../models/user.model.js';
import AppError from '../utils/AppError.js';
import { ApiResponse } from '../utils/ApiResponse.js';

// @desc Generate Flashcard from document
export const generateFlashcards = async (req, res, next) => {
  try {
    const { documentId, count = 10 } = req.body;

    if (!documentId) {
      return next(new AppError('Document ID is required', 400));
    }

    if (count < 1 || count > 20) {
      return next(new AppError('Count must be between 1 and 20', 400));
    }

    const document = await Document.findById(documentId);
    if (!document) {
      return next(new AppError('Document not found', 404));
    }

    // Generate Flashcards using gemini
    // const cards = await gemini.generateFlashcards(document.extractedText, parseInt(count));

    const flashcardSet = await Flashcard.create({
      user: req.user.id,
      document: document._id,
      cards: cards.map(card => ({
        question: card.question,
        answer: card.answer,
        difficulty: card.difficulty,
        reviewCount: 0,
        isStarred: false
      }))
    })

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
    const { documentId, numQuestions, title } = req.body;

    if (!documentId) {
      return next(new AppError('Document ID is required', 400));
    }

    const document = await Document.findOne({
      _id: documentId,
      user: req.user.id,
      status: 'ready'
    });

    if (!document) {
      return next(new AppError('Document not found', 404));
    }

    // Generate Quiz using gemini
    // const questions = await gemini.generateQuiz(
    //   document.extractedText,
    //   parseInt(numQuestions)
    // );

    // Save to db
    const quiz = await Quiz.create({
      user: req.user.id,
      document: document._id,
      title: title || `${document.title} Quiz`,
      totalQuestions: parseInt(numQuestions),
      userAnswers: [],
      score: 0
    });

    res.status(201).json(new ApiResponse(
      201,
      quiz,
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
    if (!documentId) {
      return next(new AppError('Document ID is required', 400));
    }
    
    const document = await Document.findById(documentId);
    if (!document) {
      return next(new AppError('Document not found', 404));
    }
    
    // Generate Summary using gemini
    // const summary = await gemini.generateSummary(document.extractedText);
    
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
    const {documentId, query} = req.body;
    if (!documentId || !query) {
      return next(new AppError('Document ID and query are required', 400));
    }
    
    const document = await Document.findById(documentId);
    if (!document) {
      return next(new AppError('Document not found', 404));
    }
    
    // find relevant chunks using langchain then send it to prompt with query
    // then send it to llm and send parsedOutput 
    // const response = await gemini.chat(document.extractedText, query);
    
    // Get or create chat history
    let chathistory = await Chat.findOne({
      user: req.user.id,
      document: document._id
    });

    if (!chathistory) {
      chathistory = await Chat.create({
        user: req.user.id,
        document: document._id,
        messages: []
      });
    }

    // Generate response using gemini and langchain

    chathistory.messages.push({
      role: 'user',
      content: query,
      timestamp: new Date(),
      relevantChunks: []
    }, {
      role: 'assistant',
      content: '',
      timestamp: new Date(),
      relevantChunks: chunkIndices // extracted from vector db
    });

    await chathistory.save();
    
    res.status(200).json(new ApiResponse(
      200,
      { 
        question,
        answer,
        chatId: chathistory._id  
      },
      'Chat history updated successfully'
    ));
  } catch (error) {
    next(error);
  }
}

// @desc Explain concept from document
export const explainConcept = async (req, res, next) => {
  try {
    const {documentId, concept} = req.body;
    if (!documentId || !concept) {
      return next(new AppError('Document ID and concept are required', 400));
    }
    
    const document = await Document.findById({_id: documentId, user: req.user.id, status: 'ready'});
    if (!document) {
      return next(new AppError('Document not found', 404));
    }
    
    // find relevant chunks using langchain then send it to prompt with concept
    // then send it to llm and send parsedOutput 
    // const response = await gemini.chat(document.extractedText, concept);
    // const relevantChunks = query relevant chunks from vector db
    // structure them properly
    // const context = relevantChunks.map(chunk => chunk.text).join('\n\n');

    // const explanation = await gemini.explainConcept(useContext, concept);

    res.status(200).json(new ApiResponse(
      200,
      {concept, explanation},
      'Concept explained'
    ));
    
  } catch (error) {
    next(error);
  }
}

// @desc Get chat history for document
export const getChatHistory = async (req, res, next) => {
  try {
    const {documentId} = req.params;
    if (!documentId) {
      return next(new AppError('Document ID is required', 400));
    }
    
    const chathistory = await ChatHistory.findOne({document: documentId, user: req.user.id});
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