// src/pages/CourseDetails.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getCourseById, enrollInCourse } from '../services/courseService';
import { useAuth } from '../Context/AuthContext';

const CourseDetail = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { currentUser, fetchUserProfile } = useAuth();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [enrolling, setEnrolling] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        // Simulated API call - replace with actual API
        const data = await getCourseById(courseId);
        setCourse(data);

        // Check if user is enrolled based on currentUser.enrolledCourses
        const enrolled = currentUser?.enrolledCourses?.includes(courseId);
        setIsEnrolled(enrolled || false);
      } catch (err) {
        setError('Failed to load course details');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
    
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, [courseId, currentUser]);

  const handleEnroll = async () => {
    if (!currentUser) {
      // Redirect to login if user is not logged in
      navigate('/login');
      return;
    }
    try {
      setEnrolling(true);
      const token = localStorage.getItem('token');
      await enrollInCourse(courseId, token);
      // Refresh user profile to update enrolled courses
      await fetchUserProfile(token);
      setIsEnrolled(true);
      setEnrolling(false);
    } catch (error) {
      console.error("Error enrolling:", error);
      setEnrolling(false);
    }
  }
     
     

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading course details...</p>
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8 bg-white rounded-xl shadow-md">
          <svg className="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Oops! Something went wrong</h2>
          <p className="text-gray-600 mb-6">{error || 'Course not found'}</p>
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
  console.log(course);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-teal-500 to-cyan-600 text-white">
        <div className="container mx-auto px-4 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-4xl mx-auto"
          >
            <div className="flex flex-col md:flex-row gap-8 items-center">
              <div className="md:w-2/3">
                <h1 className="text-3xl md:text-4xl font-bold mb-4">{course.title}</h1>
                <p className="text-white/80 text-lg mb-6">{course.description}</p>
                
                <div className="flex flex-wrap gap-4 mb-6">
                  <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <span>{course.duration}</span>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                    </svg>
                    <span>{course.lessonCount} lessons</span>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"></path>
                    </svg>
                    <span>{course.level}</span>
                  </div>
                </div>
                
                {isEnrolled ? (
                  <Link 
                    to={`/courses/${courseId}/learn`}
                    className="inline-block"
                  >
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-8 py-3 bg-white text-teal-600 font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      Continue Learning
                    </motion.button>
                  </Link>
                ) : (
                  <>
                    {currentUser?.role !== 'admin' ? (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleEnroll}
                        disabled={enrolling}
                        className="px-8 py-3 bg-white text-teal-600 font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 disabled:bg-gray-300 disabled:text-gray-500"
                      >
                        {enrolling ? (
                          <>
                            <span className="inline-block w-4 h-4 border-2 border-teal-600 border-t-transparent rounded-full animate-spin mr-2"></span>
                            Enrolling...
                          </>
                        ) : (
                          'Enroll Now'
                        )}
                      </motion.button>
                    ) : (
                      <p className="text-gray-600 font-medium">Admins cannot enroll in courses.</p>
                    )}
                  </>
                )}
              </div>
              
              <div className="md:w-1/3">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="relative"
                  >
                  <div className="absolute -top-4 -left-4 w-24 h-24 bg-amber-400 opacity-20 rounded-full blur-2xl"></div>
                  <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-cyan-400 opacity-20 rounded-full blur-2xl"></div>
                  <img 
  src={course.thumbnail} 
  alt={course.title} 
  className="w-full h-auto rounded-2xl shadow-xl z-10 relative"
/>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Course Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Tabs */}
          <div className="mb-8 border-b">
            <div className="flex overflow-x-auto hide-scrollbar">
              {['overview', 'curriculum', 'instructor', 'reviews'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-3 font-medium text-sm transition-all duration-300 whitespace-nowrap ${
                    activeTab === tab 
                      ? 'text-teal-600 border-b-2 border-teal-600' 
                      : 'text-gray-600 hover:text-teal-600'
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>
          </div>
          
          {/* Tab Content */}
          <div className="mb-12">
            {activeTab === 'overview' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <h2 className="text-2xl font-bold text-gray-800 mb-4">About This Course</h2>
                <p className="text-gray-600 mb-6">{course.longDescription || course.description}</p>
                
                <div className="bg-white rounded-xl shadow-md p-6 mb-8">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">What You'll Learn</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {course.outcomes?.map((outcome, index) => (
                      <div key={index} className="flex items-start">
                        <svg className="w-5 h-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                        <span className="text-gray-600">{outcome}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="bg-white rounded-xl shadow-md p-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">Requirements</h3>
                  <ul className="space-y-2">
                    {course.requirements?.map((requirement, index) => (
                      <li key={index} className="flex items-start">
                        <svg className="w-5 h-5 text-teal-500 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                        </svg>
                        <span className="text-gray-600">{requirement}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            )}
            
            {activeTab === 'curriculum' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Course Curriculum</h2>
                <p className="text-gray-600 mb-6">
                  {course.lessonCount} lessons • {course.duration} total length
                </p>
                
                <div className="bg-white rounded-xl shadow-md overflow-hidden">
                  {course.sections?.map((section, sectionIndex) => (
                    <div key={sectionIndex} className="border-b last:border-b-0">
                      <div className="p-4 bg-gray-50 flex justify-between items-center">
                        <h3 className="font-semibold text-gray-800">
                          Section {sectionIndex + 1}: {section.title}
                        </h3>
                        <span className="text-sm text-gray-600">{section.duration}</span>
                      </div>
                      <div>
                        {section.lessons.map((lesson, lessonIndex) => (
                          <div 
                            key={lessonIndex} 
                            className="p-4 border-t flex justify-between items-center hover:bg-gray-50 transition-colors duration-300"
                          >
                            <div className="flex items-center">
                              {lesson.type === 'video' ? (
                                <svg className="w-5 h-5 text-teal-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path>
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                              ) : lesson.type === 'quiz' ? (
                                <svg className="w-5 h-5 text-amber-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                              ) : (
                                <svg className="w-5 h-5 text-cyan-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                                </svg>
                              )}
                              <span className="text-gray-600">{lesson.title}</span>
                            </div>
                            <span className="text-sm text-gray-500">{lesson.duration}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                
                {!isEnrolled && (
                  <div className="mt-8 text-center">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleEnroll}
                      disabled={enrolling}
                      className="px-8 py-3 bg-gradient-to-r from-teal-500 to-cyan-600 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 disabled:from-gray-400 disabled:to-gray-500"
                    >
                      {enrolling ? 'Enrolling...' : 'Enroll Now'}
                    </motion.button>
                  </div>
                )}
              </motion.div>
            )}
            
            {activeTab === 'instructor' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Meet Your Instructor</h2>
                
                <div className="bg-white rounded-xl shadow-md p-6">
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="md:w-1/4">
                      <img 
                        src={course.instructor?.avatar || 'https://via.placeholder.com/150?text=Instructor'} 
                        alt={course.instructor?.name} 
                        className="w-32 h-32 rounded-full object-cover mx-auto md:mx-0"
                      />
                    </div>
                    <div className="md:w-3/4">
                      <h3 className="text-xl font-semibold text-gray-800 mb-2">{course.instructor?.name || 'Instructor Name'}</h3>
                      <p className="text-teal-600 font-medium mb-4">{course.instructor?.title || 'Instructor Title'}</p>
                      <p className="text-gray-600 mb-4">{course.instructor?.bio || 'Instructor bio information would go here. This would include their background, expertise, and teaching experience.'}</p>
                      
                      <div className="flex items-center space-x-4">
                        {['twitter', 'linkedin', 'github'].map(platform => (
                          <a 
                            key={platform}
                            href="#" 
                            className="text-gray-500 hover:text-teal-600 transition-colors duration-300"
                          >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-2 16h-2v-6h2v6zm-1-6.891c-.607 0-1.1-.496-1.1-1.109 0-.612.492-1.109 1.1-1.109s1.1.497 1.1 1.109c0 .613-.493 1.109-1.1 1.109zm8 6.891h-1.998v-2.861c0-1.881-2.002-1.722-2.002 0v2.861h-2v-6h2v1.093c.872-1.616 4-1.736 4 1.548v3.359z"/>
                            </svg>
                          </a>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
            
            {activeTab === 'reviews' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">Student Reviews</h2>
                  <div className="flex items-center">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <svg 
                          key={star}
                          className="w-5 h-5 text-yellow-400" 
                          fill="currentColor" 
                          viewBox="0 0 20 20" 
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                        </svg>
                      ))}
                    </div>
                    <span className="ml-2 text-gray-800 font-medium">4.8 out of 5</span>
                  </div>
                </div>
                
                <div className="space-y-6">
                  {[1, 2, 3].map((review) => (
                    <div key={review} className="bg-white rounded-xl shadow-md p-6">
                      <div className="flex justify-between mb-4">
                        <div className="flex items-center">
                          <img 
                            src={`https://randomuser.me/api/portraits/men/${review + 10}.jpg`}
                            alt="Reviewer" 
                            className="w-10 h-10 rounded-full mr-3"
                          />
                          <div>
                            <h4 className="font-medium text-gray-800">John Doe</h4>
                            <p className="text-sm text-gray-500">2 weeks ago</p>
                          </div>
                        </div>
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <svg 
                              key={star}
                              className={`w-4 h-4 ${star <= 5 ? 'text-yellow-400' : 'text-gray-300'}`}
                              fill="currentColor" 
                              viewBox="0 0 20 20" 
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                            </svg>
                          ))}
                        </div>
                      </div>
                      <h5 className="font-medium text-gray-800 mb-2">Great course, highly recommended!</h5>
                      <p className="text-gray-600">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.</p>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 text-center">
                  <button className="text-teal-600 font-medium hover:text-teal-700 transition-colors duration-300">
                    Load More Reviews
                  </button>
                </div>
              </motion.div>
            )}
          </div>
          
          {/* Related Courses */}
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Related Courses</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((item) => (
                <div key={item} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300">
                  <img 
                    src={`https://via.placeholder.com/400x200?text=Related+Course+${item}`} 
                    alt={`Related Course ${item}`} 
                    className="w-full h-40 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-800 mb-2">Related Course Title</h3>
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">Brief description of the related course goes here.</p>
                    <Link 
                      to={`/courses/${item}`}
                      className="text-teal-600 font-medium hover:text-teal-700 transition-colors duration-300"
                    >
                      View Course →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
