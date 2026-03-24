import mongoose from 'mongoose';

const documentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  fileName: { type: String, required: true },
  fileUrl: { type: String, required: true },
  fileId: { type: String, default: '' },
  fileSize: { type: Number, required: true },
  mimeType: { type: String, required: true },   
  totalChunks: { type: Number, default: 0 },
  extractedText: { type: String, default: '' },
  uploadDate: { type: Date, default: Date.now },
  lastAccessed: { type: Date, default: Date.now },
  flashcardCount: { type: Number, default: 0 },
  quizCount: { type: Number, default: 0 },
  status: { type: String, enum: ['processing', 'ready', 'failed'], default: 'processing' }
}, { timestamps: true });

documentSchema.index({ user: 1, uploadDate: -1 });

const Document = mongoose.model('Document', documentSchema);

export default Document;