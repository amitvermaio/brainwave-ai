import mongoose from 'mongoose';

const chatSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  document: { type: mongoose.Schema.Types.ObjectId, ref: 'Document', required: true },
  messages: [{
    role: { type: String, enum: ['user', 'assistant'], required: true },
    content: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    relevantChunks: { type: [Number], default: [] }
  }]
}, { timestamps: true });

chatSchema.index({ user: 1, document: 1 });

const Chat = mongoose.model('Chat', chatSchema);

export default Chat;