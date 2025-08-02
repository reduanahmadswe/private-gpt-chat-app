import mongoose, { Schema, Document } from 'mongoose';
import { IChat, IMessage } from './chat.interface';

type ChatDocument = Document & IChat;

const messageSchema = new Schema<IMessage>(
  {
    role: {
      type: String,
      required: true,
      enum: ['user', 'assistant'],
    },
    content: {
      type: String,
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

const chatSchema = new Schema<ChatDocument>(
  {
    userId: {
      type: String,
      required: true,
      ref: 'User',
    },
    title: {
      type: String,
      required: true,
      default: 'New Chat',
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    messages: {
      type: [messageSchema],
      default: [],
    },
    isShared: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Index for better query performance
chatSchema.index({ userId: 1, createdAt: -1 });

export const Chat = mongoose.model<ChatDocument>('Chat', chatSchema);
