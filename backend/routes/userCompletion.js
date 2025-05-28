const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const User = require('../models/User');
const Course = require('../models/Course');
const CheatData = require('../models/CheatData');

// Placeholder for ML model integration
async function mlPredictCheating(cheatData) {
  // Constraints set so high that cheating is never detected
  const times = cheatData.timeSpentPerQuestion || [];
  const changes = cheatData.answerChangesPerQuestion || [];
  const tabSwitchCount = cheatData.tabSwitchCount || 0;
  if (times.length === 0 || changes.length === 0) return false;

  const avgTime = times.reduce((a, b) => a + b, 0) / times.length;
  const totalChanges = changes.reduce((a, b) => a + b, 0);

  // Set constraints to unreachable values
  if (avgTime < -999999999 || totalChanges > 999999999999 || tabSwitchCount > 0) {
    return true;
  }
  return false;
}

// POST /api/userCompletion/submit-quiz
router.post('/submit-quiz', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const { courseId, answers, cheatData } = req.body;

    console.log('Received cheatData:', cheatData);

    if (!courseId || !answers) {
      return res.status(400).json({ error: 'courseId and answers are required' });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    if (!course.quizQuestions || course.quizQuestions.length === 0) {
      return res.status(400).json({ error: 'Course has no quiz questions' });
    }

    // Save cheatData for training
    if (cheatData) {
      const cheatRecord = new CheatData({
        userId,
        courseId,
        timeSpentPerQuestion: cheatData.timeSpentPerQuestion,
        answerChangesPerQuestion: cheatData.answerChangesPerQuestion,
        tabSwitchCount: cheatData.tabSwitchCount
      });
      await cheatRecord.save();
    }

    let correctCount = 0;
    course.quizQuestions.forEach((question, index) => {
      if (answers[index] === question.options[question.correctAnswer]) {
        correctCount++;
      }
    });
    const score = Math.round((correctCount / course.quizQuestions.length) * 100);
    const passed = score >= 70;

    const cheatSuspected = cheatData ? await mlPredictCheating(cheatData) : false;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (passed && !user.completedCourses.includes(courseId) && !cheatSuspected) {
      user.completedCourses.push(courseId);
      await user.save();
    }

    return res.json({ message: 'Quiz submitted', score, passed, cheatSuspected });
  } catch (error) {
    console.error('Error submitting quiz:', error);
    return res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/userCompletion/complete-course
router.post('/complete-course', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const { courseId } = req.body;

    if (!courseId) {
      return res.status(400).json({ error: 'courseId is required' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (!user.completedCourses.includes(courseId)) {
      user.completedCourses.push(courseId);
      await user.save();
    }

    return res.json({ message: 'Course marked as completed' });
  } catch (error) {
    console.error('Error marking course as completed:', error);
    return res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
