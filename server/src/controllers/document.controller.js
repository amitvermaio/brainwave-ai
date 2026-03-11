import Document from '../models/document.model.js';
import FlashCard from '../models/flashcard.model.js';
import Quiz from '../models/quiz.model.js';
import { extractTextFromPdf } from '../utils/pdfParser.js';
import { chunkText } from '../utils/textChunker.js';
import AppError from '../utils/AppError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import imagekit from '../config/imagekit.js';
import { pineconeIndex } from '../config/pinecone.js';
import { GoogleGenerativeAIEmbeddings } from '@langchain/google-genai';
import config from '../config/config.js';

const embeddings = new GoogleGenerativeAIEmbeddings({
  apiKey: config.googleApiKey,
  modelName: 'embedding-001',
});

/**
 * Helper: Generate embeddings for chunks and upsert them into Pinecone.
 * Each vector is stored with metadata: userId, documentId, chunkIndex, and the text content.
 */
const storeChunksInPinecone = async (chunks, documentId, userId) => {
  const texts = chunks.map((c) => c.content);
  const vectors = await embeddings.embedDocuments(texts);

  const pineconeVectors = vectors.map((values, i) => ({
    id: `${documentId}_chunk_${i}`,
    values,
    metadata: {
      userId: userId.toString(),
      documentId: documentId.toString(),
      chunkIndex: i,
      content: texts[i].slice(0, 1000), // Pinecone metadata limit ~40KB; keep it safe
    },
  }));

  // Upsert in batches of 100 (Pinecone best practice)
  const BATCH_SIZE = 100;
  for (let i = 0; i < pineconeVectors.length; i += BATCH_SIZE) {
    const batch = pineconeVectors.slice(i, i + BATCH_SIZE);
    await pineconeIndex.upsert(batch);
  }
};


const deleteDocumentFromPinecone = async (documentId, totalChunks) => {
  const ids = Array.from({ length: totalChunks }, (_, i) => `${documentId}_chunk_${i}`);

  const BATCH_SIZE = 100;
  for (let i = 0; i < ids.length; i += BATCH_SIZE) {
    const batch = ids.slice(i, i + BATCH_SIZE);
    await pineconeIndex.deleteMany(batch);
  }
};

export const uploadDocument = async (req, res, next) => {
  try {
    if (!req.file) {
      return next(new AppError('No file uploaded', 400));
    }

    const { title } = req.body;
    if (!title) {
      return next(new AppError('Document title is required', 400));
    }

    const userId = req.user._id;
    const fileBuffer = req.file.buffer;
    const originalName = req.file.originalname;

    const uploadResponse = await imagekit.upload({
      file: fileBuffer,
      fileName: originalName,
      folder: `/documents/${userId}`,
      tags: ['pdf', 'document'],
    });

    const extractedText = await extractTextFromPdf(fileBuffer);
    if (!extractedText || extractedText.trim().length === 0) {
      return next(new AppError('Could not extract text from PDF. The file may be scanned/image-based.', 400));
    }

    // Chunk the extracted text
    const chunks = chunkText(extractedText, { chunkSize: 1000, chunkOverlap: 200 });

    const document = await Document.create({
      user: userId,
      title,
      fileName: originalName,
      fileUrl: uploadResponse.url,
      fileId: uploadResponse.fileId, 
      fileSize: req.file.size,
      totalChunks: chunks.length,
      status: 'processing',
    });

    try {
      await storeChunksInPinecone(chunks, document._id, userId);
      document.status = 'ready';
    } catch (embeddingError) {
      console.error('Embedding error:', embeddingError.message);
      document.status = 'failed';
    }
    await document.save();

    res.status(201).json(
      new ApiResponse(201, {
        document: {
          _id: document._id,
          title: document.title,
          fileName: document.fileName,
          fileUrl: document.fileUrl,
          fileSize: document.fileSize,
          status: document.status,
          totalChunks: chunks.length,
          uploadDate: document.uploadDate,
        },
      }, 'Document uploaded and processed successfully')
    );
  } catch (error) {
    next(error);
  }
};

export const getDocuments = async (req, res, next) => {
  try {
    const documents = await Document.find({ user: req.user._id })
      .sort({ uploadDate: -1 });

    res.status(200).json(
      new ApiResponse(200, { documents }, 'Documents fetched successfully')
    );
  } catch (error) {
    next(error);
  }
};

export const getDocumentById = async (req, res, next) => {
  try {
    const document = await Document.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!document) {
      return next(new AppError('Document not found', 404));
    }

    document.lastAccessed = new Date();
    await document.save();

    res.status(200).json(
      new ApiResponse(200, { document }, 'Document fetched successfully')
    );
  } catch (error) {
    next(error);
  }
};

export const deleteDocument = async (req, res, next) => {
  try {
    const document = await Document.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!document) {
      return next(new AppError('Document not found', 404));
    }

    if (document.fileId) {
      try {
        await imagekit.deleteFile(document.fileId);
      } catch (ikError) {
        console.error('ImageKit deletion error:', ikError.message);
      }
    }

    // Delete vectors from Pinecone
    if (document.totalChunks > 0) {
      try {
        await deleteDocumentFromPinecone(document._id, document.totalChunks);
      } catch (pcError) {
        console.error('Pinecone deletion error:', pcError.message);
      }
    }

    await Promise.all([
      FlashCard.deleteMany({ document: document._id }),
      Quiz.deleteMany({ document: document._id }),
    ]);

    await Document.findByIdAndDelete(document._id);

    res.status(200).json(
      new ApiResponse(200, null, 'Document and all related data deleted successfully')
    );
  } catch (error) {
    next(error);
  }
};

export const updateDocument = async (req, res, next) => {
  try {
    const { title } = req.body;
    if (!title) {
      return next(new AppError('Title is required', 400));
    }

    const document = await Document.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { title },
      { new: true, runValidators: true }
    );

    if (!document) {
      return next(new AppError('Document not found', 404));
    }

    res.status(200).json(
      new ApiResponse(200, { document }, 'Document updated successfully')
    );
  } catch (error) {
    next(error);
  }
};