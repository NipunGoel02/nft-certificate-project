const express = require('express');
const router = express.Router();
const Course = require('../models/Course');
const { auth, isAdmin } = require('../middleware/auth');

// Admin routes - protected with auth and isAdmin middleware
// Get all courses (admin only) - filtered by createdBy (current admin)
router.get('/admin/courses', auth, isAdmin, async (req, res) => {
  try {
    const courses = await Course.find({ createdBy: req.user.id });
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single course (admin only)
router.get('/admin/courses/:id', auth, isAdmin, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    res.json(course);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/admin/courses', auth, isAdmin, async (req, res) => {
  try {
    const course = new Course({
      title: req.body.title,
      description: req.body.description,
      longDescription: req.body.longDescription,
      instructor: {
        name: req.body.instructor?.name,
        title: req.body.instructor?.title,
        bio: req.body.instructor?.bio,
        avatar: req.body.instructor?.avatar,
      },
      thumbnail: req.body.thumbnail,
      duration: req.body.duration,
      level: req.body.level,
      price: req.body.price,
      lessonCount: req.body.lessonCount || 0,
      category: req.body.category, // Added category
      outcomes: req.body.outcomes || [],
      requirements: req.body.requirements || [],
      sections: req.body.sections || [],
      quizQuestions: req.body.quizQuestions || [], // Added quizQuestions
      createdBy: req.user.id,
    });

    const savedCourse = await course.save();
    res.status(201).json(savedCourse);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update course (admin only)
router.put('/admin/courses/:id', auth, isAdmin, async (req, res) => {
  try {
    const updatedCourse = await Course.findByIdAndUpdate(
      req.params.id,
      {
        title: req.body.title,
        description: req.body.description,
        longDescription: req.body.longDescription,
        instructor: {
          name: req.body.instructor?.name,
          title: req.body.instructor?.title,
          bio: req.body.instructor?.bio,
          avatar: req.body.instructor?.avatar,
        },
        thumbnail: req.body.thumbnail,
        duration: req.body.duration,
        level: req.body.level,
        price: req.body.price,
        lessonCount: req.body.lessonCount,
        category: req.body.category, // Added category
        outcomes: req.body.outcomes,
        requirements: req.body.requirements,
        sections: req.body.sections,
        quizQuestions: req.body.quizQuestions || [], // Added quizQuestions
      },
      { new: true }
    );

    if (!updatedCourse) {
      return res.status(404).json({ message: 'Course not found' });
    }
    res.json(updatedCourse);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete course (admin only)
router.delete('/admin/courses/:id', auth, isAdmin, async (req, res) => {
  try {
    const deletedCourse = await Course.findByIdAndDelete(req.params.id);
    if (!deletedCourse) {
      return res.status(404).json({ message: 'Course not found' });
    }
    res.json({ message: 'Course deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Public routes
// Get all courses
router.get('/', async (req, res) => {
  try {
    const courses = await Course.find().select(
      'title description thumbnail instructor.name level duration price category'
    );
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single course
router.get('/:id', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Calculate lesson count if not already set
    if (!course.lessonCount) {
      let count = 0;
      course.sections?.forEach((section) => {
        count += section.lessons?.length || 0;
      });
      course.lessonCount = count;
      await course.save();
    }

    res.json(course);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Enroll in a course
router.post('/:id/enroll', auth, async (req, res) => {
  try {
    const courseId = req.params.id;
    const userId = req.user.id;

    // Check if course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Update user's enrolled courses (handled in user routes)
    // This is just to confirm enrollment
    res.json({ success: true, message: 'Successfully enrolled in course' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get course curriculum
router.get('/:id/curriculum', auth, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).select('sections');
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    res.json(course.sections);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get course reviews
router.get('/:id/reviews', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).populate('reviews');
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    res.json(course.reviews || []);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add review to course
router.post('/:id/reviews', auth, async (req, res) => {
  try {
    const { rating, title, content } = req.body;
    const courseId = req.params.id;
    const userId = req.user.id;

    // Implementation would depend on your review model
    // This is a placeholder
    res.json({ success: true, message: 'Review added successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;