// src/pages/CourseLearning.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getCourseById } from '../services/courseService';
import ReactPlayer from 'react-player';
import Quiz from '../pages/Quiz';

const CourseLearning = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [progress, setProgress] = useState(0);
  const [completedLessons, setCompletedLessons] = useState([]);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        // Simulated API call - replace with actual API
        const data = await getCourseById(courseId);
        setCourse(data);         
        // Simulated progress data
        setProgress(30); // 30% complete
        setCompletedLessons(['lesson1', 'lesson2', 'lesson3']);
      } catch (err) {
        setError('Failed to load course content');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
    
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, [courseId]);

  const handleLessonComplete = () => {
    // Mark current lesson as complete
    if (!completedLessons.includes(`lesson${currentLessonIndex}`)) {
      const newCompletedLessons = [...completedLessons, `lesson${currentLessonIndex}`];
      setCompletedLessons(newCompletedLessons);
      
      // Calculate new progress
      const totalLessons = course.sections.reduce((total, section) => total + section.lessons.length, 0);
      const newProgress = Math.round((newCompletedLessons.length / totalLessons) * 100);
      setProgress(newProgress);
    }
  };

  const handleNextLesson = () => {
    // Mark current lesson as complete
    handleLessonComplete();
    
    // Navigate to next lesson
    const currentSection = course.sections[currentSectionIndex];
    if (currentLessonIndex < currentSection.lessons.length - 1) {
      // Next lesson in same section
      setCurrentLessonIndex(currentLessonIndex + 1);
    } else if (currentSectionIndex < course.sections.length - 1) {
      // First lesson in next section
      setCurrentSectionIndex(currentSectionIndex + 1);
      setCurrentLessonIndex(0);
    } else {
      // Course completed
      navigate(`/courses/${courseId}/quiz`);
    }
  };

  const handleSelectLesson = (sectionIndex, lessonIndex) => {
    setCurrentSectionIndex(sectionIndex);
    setCurrentLessonIndex(lessonIndex);
    setIsSidebarOpen(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center pt-20">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading course content...</p>
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center pt-20">
        <div className="text-center max-w-md mx-auto p-8 bg-white rounded-xl shadow-md">
          <svg className="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Oops! Something went wrong</h2>
          <p className="text-gray-600 mb-6">{error || 'Course content not found'}</p>
          <Link 
            to="/courses" 
            className="inline-block px-6 py-3 bg-teal-500 text-white font-medium rounded-lg hover:bg-teal-600 transition-colors duration-300"
          >
            Back to Courses
          </Link>
        </div>
      </div>
    );
  }

  const currentSection = course.sections[currentSectionIndex];
  const currentLesson = currentSection.lessons[currentLessonIndex];

  return (
    <div className="min-h-screen bg-gray-50 pt-16 flex flex-col">
      {/* Top Navigation */}
      <div className="bg-white shadow-sm border-b fixed top-16 left-0 right-0 z-10">
        <div className="container mx-auto px-4 py-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <button 
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="mr-4 text-gray-600 hover:text-teal-600 md:hidden"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
                </svg>
              </button>
              <Link to={`/courses/${courseId}`} className="text-gray-600 hover:text-teal-600 flex items-center">
                <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                </svg>
                <span className="hidden md:inline">Back to Course</span>
              </Link>
            </div>
            
            <h1 className="text-lg font-semibold text-gray-800 truncate max-w-md">
              {course.title}
            </h1>
            
            <div className="flex items-center">
              <div className="hidden md:block w-48 bg-gray-200 rounded-full h-2.5 mr-4">
                <div 
                  className="bg-teal-600 h-2.5 rounded-full" 
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <span className="text-sm text-gray-600">{progress}% Complete</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex flex-1 overflow-hidden mt-16">
        {/* Sidebar - Curriculum */}
        <motion.div 
          className={`fixed inset-0 z-40 md:relative md:z-0 bg-white md:w-80 md:flex-shrink-0 transform transition-transform duration-300 ease-in-out ${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
          } shadow-lg md:shadow-none`}
          initial={false}
        >
          <div className="h-full flex flex-col">
            <div className="p-4 border-b flex justify-between items-center">
              <h2 className="font-semibold text-gray-800">Course Content</h2>
              <button 
                onClick={() => setIsSidebarOpen(false)}
                className="text-gray-600 hover:text-teal-600 md:hidden"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto">
              {course.sections.map((section, sectionIndex) => (
                <div key={sectionIndex} className="border-b">
                  <div className="p-4 bg-gray-50 flex justify-between items-center">
                    <h3 className="font-medium text-gray-800">
                      Section {sectionIndex + 1}: {section.title}
                    </h3>
                  </div>
                  <div>
                    {section.lessons.map((lesson, lessonIndex) => {
                      const isActive = sectionIndex === currentSectionIndex && lessonIndex === currentLessonIndex;
                      const isCompleted = completedLessons.includes(`lesson${lessonIndex}`);
                      
                      return (
                        <button
                          key={lessonIndex}
                          onClick={() => handleSelectLesson(sectionIndex, lessonIndex)}
                          className={`w-full text-left p-4 border-t flex items-center transition-colors duration-300 ${
                            isActive ? 'bg-teal-50 text-teal-600' : isCompleted ? 'bg-green-50' : 'hover:bg-gray-50'
                          }`}
                        >
                          {isCompleted ? (
                            <svg className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                            </svg>
                          ) : lesson.type === 'video' ? (
                            <svg className="w-5 h-5 text-teal-500 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path>
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                          ) : lesson.type === 'quiz' ? (
                            <svg className="w-5 h-5 text-amber-500 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                          ) : (
                            <svg className="w-5 h-5 text-gray-500 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                            </svg>
                          )}
                          <div className="flex-1">
                            <span className={`${isActive ? 'font-medium' : ''}`}>{lesson.title}</span>
                            <span className="text-sm text-gray-500 block">{lesson.duration}</span>
                          </div>
                          {isActive && (
                            <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                            </svg>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
        
        {/* Main Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-4xl mx-auto">
            {/* Lesson Title */}
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                {currentLesson.title}
              </h2>
              <div className="flex items-center text-gray-600">
                <span>Section {currentSectionIndex + 1}, Lesson {currentLessonIndex + 1}</span>
                <span className="mx-2">•</span>
                <span>{currentLesson.duration}</span>
              </div>
            </div>
            
            {/* Lesson Content */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
              {currentLesson.type === 'video' ? (
                <div className="aspect-w-16 aspect-h-9 bg-gray-900">
                  <ReactPlayer
                    url={currentLesson.content || "https://www.youtube.com/watch?v=ysz5S6PUM-U"}
                    width="100%"
                    height="100%"
                    controls={true}
                    playing={true}
                    onEnded={handleLessonComplete}
                    onProgress={(state) => {
                      if (state.played > 0.9) { // Mark complete after 90% watched
                        handleLessonComplete();
                      }
                    }}
                    config={{
                      youtube: {
                        playerVars: { showinfo: 1 }
                      }
                    }}
                  />
                </div>
              ) : currentLesson.type === 'quiz' ? (
                <div className="p-6">
                  <Quiz 
                    questions={currentLesson.questions || [
                      {
                        question: "What is React?",
                        options: [
                          "A JavaScript library for building user interfaces",
                          "A programming language",
                          "A database system",
                          "A server-side framework"
                        ],
                        correctAnswer: "A JavaScript library for building user interfaces"
                      }
                    ]}
                    onComplete={(score, total) => {
                      handleLessonComplete();
                      alert(`You scored ${score} out of ${total}`);
                    }}
                  />
                </div>
              ) : (
                <div className="p-6">
                  <div className="prose max-w-none">
                    <h3>Lesson Content</h3>
                    <p>This is placeholder content for the lesson. In a real application, this would be replaced with actual lesson content, which could include text, images, code snippets, and other educational materials.</p>
                    <p>The content would be formatted using HTML or Markdown and could include interactive elements as needed for the specific lesson.</p>
                    <h4>Key Points</h4>
                    <ul>
                      <li>First key point about this lesson</li>
                      <li>Second important concept to understand</li>
                      <li>Third element that students should remember</li>
                    </ul>
                    <p>Additional explanations and examples would be provided here to ensure students fully grasp the concepts being taught.</p>
                  </div>
                </div>
              )}
            </div>
            
            {/* Navigation Buttons */}
            <div className="flex justify-between items-center">
              <button
                onClick={() => {
                  if (currentLessonIndex > 0) {
                    setCurrentLessonIndex(currentLessonIndex - 1);
                  } else if (currentSectionIndex > 0) {
                    const prevSection = course.sections[currentSectionIndex - 1];
                    setCurrentSectionIndex(currentSectionIndex - 1);
                    setCurrentLessonIndex(prevSection.lessons.length - 1);
                  }
                }}
                disabled={currentSectionIndex === 0 && currentLessonIndex === 0}
                className="flex items-center px-4 py-2 border rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
                </svg>
                Previous Lesson
              </button>
              
              <button
                onClick={handleNextLesson}
                className="flex items-center px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
              >
                {currentSectionIndex === course.sections.length - 1 && 
                 currentLessonIndex === currentSection.lessons.length - 1 
                  ? 'Complete & Take Quiz' 
                  : 'Next Lesson'}
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseLearning;
