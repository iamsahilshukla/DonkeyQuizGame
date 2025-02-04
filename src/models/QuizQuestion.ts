// src/models/question.model.ts
import mongoose, { Schema } from 'mongoose';

const questionSchema = new Schema({
  text: { type: String, required: true },
  options: { type: [String], required: true },
  correctAnswer: { type: String, required: true },
  timeLimit: { type: Number, default: 30 },
  points: { type: Number, default: 100 },
});

export const Question = mongoose.model('Question', questionSchema);
