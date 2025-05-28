const mongoose = require('mongoose');
const Course = require('../models/Course');
require('dotenv').config();
 const MONGO_URI= "mongodb+srv://nipungoel15:qahxnwKHzNPGrUwF@cluster0.p7n6x.mongodb.net/nft-certificate";

async function updateCourseContent() {
  try {
    await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to MongoDB');

    const courseId = '6822260ad979761953f85c4c';

    const course = await Course.findById(courseId);
    if (!course) {
      console.log('Course not found');
      return;
    }

    course.sections = [
      {
        title: 'Introduction',
        duration: '10 mins',
        lessons: [
          {
            title: 'Welcome to the Course',
            type: 'video',
            content: 'https://www.youtube.com/watch?v=ysz5S6PUM-U',
            duration: '5 mins'
          },
          {
            title: 'Course Overview',
            type: 'text',
            content: 'This lesson provides an overview of the course content and objectives.',
            duration: '5 mins'
          }
        ]
      },
      {
        title: 'Advanced Topics',
        duration: '20 mins',
        lessons: [
          {
            title: 'Deep Dive into Concepts',
            type: 'video',
            content: 'https://www.youtube.com/watch?v=ysz5S6PUM-U',
            duration: '15 mins'
          },
          {
            title: 'Quiz: Test Your Knowledge',
            type: 'quiz',
            content: '',
            duration: '5 mins',
            questions: [
              {
                question: 'What is React?',
                options: [
                  'A JavaScript library for building user interfaces',
                  'A programming language',
                  'A database system',
                  'A server-side framework'
                ],
                correctAnswer: 'A JavaScript library for building user interfaces'
              }
            ]
          }
        ]
      }
    ];

    await course.save();
    console.log('Course content updated successfully');
    mongoose.disconnect();
  } catch (error) {
    console.error('Error updating course content:', error);
    mongoose.disconnect();
  }
}

updateCourseContent();
