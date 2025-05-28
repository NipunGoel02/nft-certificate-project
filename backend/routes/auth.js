// ... existing imports and routes ...
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { auth } = require('../middleware/auth');

const bcrypt = require('bcryptjs');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');

const JWT_SECRET = 'supersecretkey12345'; // Must match middleware auth.js

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, '../uploads/profile_pictures');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, req.user.id + ext);
  }
});
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: function (req, file, cb) {
    const allowedTypes = /jpeg|jpg|png/;
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedTypes.test(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Only JPEG and PNG images are allowed'));
    }
  }
});

// Signup route
// Signup route
router.post('/signup', async (req, res) => {
  const { name, email, password, role } = req.body; // Extract role from request
  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }
    user = new User({ name, email, password, role }); // Include role when creating user
    await user.save();

    // Link any pending internship certificateRequests with this email to the new user
    const Internship = require('../models/Internship');
    await Internship.updateMany(
      { 'certificateRequests.email': email, 'certificateRequests.participant': null },
      { $set: { 'certificateRequests.$.participant': user._id } }
    );

    const payload = {
      user: {
        id: user.id,
        email: user.email, // Include email in JWT payload
        role: user.role // Include role in JWT payload
      }
    };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Login route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
  const payload = {
  user: {
    id: user.id,
    email: user.email, // Include email in JWT payload
    role: user.role // Include role in JWT payload
  }
};
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});



// Existing routes...

// Get user profile route (protected)
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// New public route to get user profile by id
router.get('/users/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid user id' });
    }
    const user = await User.findById(userId)
      .select('-password')
      .populate('registeredHackathons')
      .lean();

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Fetch enrolled courses details
    const Course = require('../models/Course');
    const enrolledCourses = await Course.find({ _id: { $in: user.enrolledCourses } }).select('title description thumbnail');

    // Fetch completed courses details
    const completedCourses = await Course.find({ _id: { $in: user.completedCourses || [] } }).select('title description thumbnail');

    // Fetch internships where user is participant
    const Internship = require('../models/Internship');
    const internships = await Internship.find({ participants: user._id }).select('title description startDate endDate');

    // Attach fetched data
    user.enrolledCoursesDetails = enrolledCourses;
    user.completedCoursesDetails = completedCourses;
    user.internships = internships;

    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Enroll in course route (protected)
router.post('/enroll', auth, async (req, res) => {
  const { courseId } = req.body;
  if (!courseId) {
    return res.status(400).json({ message: 'Course ID is required' });
  }
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    if (!user.enrolledCourses.includes(courseId)) {
      user.enrolledCourses.push(courseId);
      await user.save();
    }
    res.json({ success: true, enrolledCourses: user.enrolledCourses });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Upload profile picture route (protected)
router.post('/profile/picture', auth, upload.single('profilePicture'), async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    user.profilePicture = `/uploads/profile_pictures/${req.file.filename}`;
    await user.save();
    res.json({ success: true, profilePicture: user.profilePicture });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to upload profile picture' });
  }
});
// Get current user's profile picture
router.get('/profile/picture', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('profilePicture');
    if (!user || !user.profilePicture) {
      return res.status(404).json({ message: 'Profile picture not found' });
    }
    res.json({ profilePicture: user.profilePicture });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch profile picture' });
  }
});

router.patch('/wallet', auth, async (req, res) => {
  try {
    const { walletAddress } = req.body;
    if (!walletAddress) {
      return res.status(400).json({ message: 'walletAddress is required' });
    }
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    user.walletAddress = walletAddress;
    await user.save();
    res.json({ success: true, walletAddress: user.walletAddress });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
