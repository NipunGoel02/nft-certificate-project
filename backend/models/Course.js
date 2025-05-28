const mongoose = require('mongoose');

// Existing schemas
const lessonSchema = new mongoose.Schema({
  title: String,
  type: { type: String, enum: ['video', 'quiz', 'text'], default: 'video' },
  content: String,
  duration: String
});

const sectionSchema = new mongoose.Schema({
  title: String,
  duration: String,
  lessons: [lessonSchema]
});

const instructorSchema = new mongoose.Schema({
  name: String,
  title: String,
  bio: String,
  avatar: String
});

// New quiz question schema
const quizOptionSchema = new mongoose.Schema({
  text: String,
  isCorrect: { type: Boolean, default: false }
});

const quizQuestionSchema = new mongoose.Schema({
  question: String,
  options: [String],
  correctAnswer: Number
});

// Updated course schema with quizQuestions
const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  longDescription: String,
  instructor: instructorSchema,
  thumbnail: String,
  duration: String,
  level: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'], default: 'Beginner' },
  price: { type: Number, default: 0 },
  lessonCount: { type: Number, default: 0 },
  category: { type: String, required: true }, // Added category field
  outcomes: [String],
  requirements: [String],
  sections: [sectionSchema],
  quizQuestions: [quizQuestionSchema], // Added quiz questions array
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Course', courseSchema);
