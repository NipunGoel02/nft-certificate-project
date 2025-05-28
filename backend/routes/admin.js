const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../models/User');
const Course = require('../models/Course');
const { auth, isAdmin } = require('../middleware/auth');

// Get users enrolled in courses created by current admin
router.get('/users', auth, isAdmin, async (req, res) => {
  try {
    // Step 1: Get all course IDs created by this admin
    const adminCourses = await Course.find({ createdBy: req.user.id }).select('_id');
    const adminCourseIds = adminCourses.map(course => course._id.toString());

    // Step 2: Find users who have any of those course IDs in enrolledCourses
    const users = await User.find({
      enrolledCourses: { $in: adminCourseIds }
    }).select('name email enrolledCourses');

    // Step 3: Collect all unique course IDs from these users
    const allEnrolledCourseIds = new Set();
    users.forEach(user => {
      user.enrolledCourses.forEach(courseId => allEnrolledCourseIds.add(courseId.toString()));
    });

    // Step 4: Filter only valid ObjectIds and convert to ObjectId type
    const validCourseObjectIds = Array.from(allEnrolledCourseIds)
      .filter(id => mongoose.Types.ObjectId.isValid(id))
      .map(id => new mongoose.Types.ObjectId(id));

    // Step 5: Fetch the actual course titles
    const allCourses = await Course.find({ _id: { $in: validCourseObjectIds } }).select('title');

    // Step 6: Create a mapping of courseId -> title
    const courseMap = {};
    allCourses.forEach(course => {
      courseMap[course._id.toString()] = course.title;
    });

    // Step 7: Format the user data
    const formattedUsers = users.map(user => ({
      name: user.name,
      email: user.email,
      enrolledCourses: user.enrolledCourses
        .map(courseId => courseMap[courseId.toString()])
        .filter(Boolean)
    }));

    res.json({ users: formattedUsers });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
