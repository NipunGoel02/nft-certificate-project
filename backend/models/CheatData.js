const mongoose = require('mongoose');

const CheatDataSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  timeSpentPerQuestion: { type: [Number], required: true },
  answerChangesPerQuestion: { type: [Number], required: true },
  tabSwitchCount: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('CheatData', CheatDataSchema);
