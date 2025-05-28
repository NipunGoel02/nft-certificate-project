import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

export default function CourseForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
    const [course, setCourse] = useState({
      title: '',
      description: '',
      longDescription: '',
      thumbnail: '',
      duration: '',
      level: 'Beginner',
      price: 0, 
      lessonCount: 0,
      category: '', // Added category field
      instructor: {
        name: '',
        title: '',
        bio: '',
        avatar: ''
      },
      sections: [
        {
          title: '',
          duration: '',
          lessons: [
            {
              title: '',
              type: 'video',
              content: '',
              duration: ''
            }
          ]
        }
      ],
      outcomes: [''],
      requirements: [''],
      quizQuestions: [
        {
          question: '',
          options: ['', '', '', ''],
          correctAnswer: 0
        }
      ]
    });

  // Load existing course data if editing
  React.useEffect(() => {
    if (id) {
      const fetchCourse = async () => {
        try {
          const token = localStorage.getItem('token');
          const config = {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          };
          const response = await axios.get(`/api/courses/admin/courses/${id}`, config);
          setCourse(response.data);
        } catch (error) {
          console.error('Failed to load course data:', error);
          alert('Failed to load course data for editing.');
        }
      };
      fetchCourse();
    }
  }, [id]);

  const totalSteps = 5;

  const nextStep = () => setStep(prev => Math.min(prev + 1, totalSteps));
  const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

  const variants = {
    enter: (direction) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1
    },
    exit: (direction) => ({
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    })
  };

  // Handlers for dynamic arrays
  const handleOutcomeChange = (index, value) => {
    const newOutcomes = [...course.outcomes];
    newOutcomes[index] = value;
    setCourse({ ...course, outcomes: newOutcomes });
  };

  const addOutcome = () => {
    setCourse({ ...course, outcomes: [...course.outcomes, ''] });
  };

  const removeOutcome = (index) => {
    const newOutcomes = course.outcomes.filter((_, i) => i !== index);
    setCourse({ ...course, outcomes: newOutcomes });
  };

  const handleRequirementChange = (index, value) => {
    const newRequirements = [...course.requirements];
    newRequirements[index] = value;
    setCourse({ ...course, requirements: newRequirements });
  };

  const addRequirement = () => {
    setCourse({ ...course, requirements: [...course.requirements, ''] });
  };

  const removeRequirement = (index) => {
    const newRequirements = course.requirements.filter((_, i) => i !== index);
    setCourse({ ...course, requirements: newRequirements });
  };

  const handleQuizQuestionChange = (index, field, value) => {
    const newQuizQuestions = [...course.quizQuestions];
    if (field === 'question') {
      newQuizQuestions[index].question = value;
    } else if (field.startsWith('option')) {
      const optionIndex = parseInt(field.slice(-1));
      newQuizQuestions[index].options[optionIndex] = value;
    } else if (field === 'correctAnswer') {
      newQuizQuestions[index].correctAnswer = parseInt(value);
    }
    setCourse({ ...course, quizQuestions: newQuizQuestions });
  };

  const addQuizQuestion = () => {
    setCourse({
      ...course,
      quizQuestions: [
        ...course.quizQuestions,
        { question: '', options: ['', '', '', ''], correctAnswer: 0 }
      ]
    });
  };

  const removeQuizQuestion = (index) => {
    const newQuizQuestions = course.quizQuestions.filter((_, i) => i !== index);
    setCourse({ ...course, quizQuestions: newQuizQuestions });
  };

  // Handlers for sections and lessons
  const handleSectionChange = (index, field, value) => {
    const newSections = [...course.sections];
    newSections[index][field] = value;
    setCourse({ ...course, sections: newSections });
  };

  const addSection = () => {
    setCourse({
      ...course,
      sections: [...course.sections, { title: '', duration: '', lessons: [{ title: '', type: 'video', content: '', duration: '' }] }]
    });
  };

  const removeSection = (index) => {
    const newSections = course.sections.filter((_, i) => i !== index);
    setCourse({ ...course, sections: newSections });
  };

  const handleLessonChange = (sectionIndex, lessonIndex, field, value) => {
    const newSections = [...course.sections];
    newSections[sectionIndex].lessons[lessonIndex][field] = value;
    setCourse({ ...course, sections: newSections });
  };

  const addLesson = (sectionIndex) => {
    const newSections = [...course.sections];
    newSections[sectionIndex].lessons.push({ title: '', type: 'video', content: '', duration: '' });
    setCourse({ ...course, sections: newSections });
  };

  const removeLesson = (sectionIndex, lessonIndex) => {
    const newSections = [...course.sections];
    newSections[sectionIndex].lessons = newSections[sectionIndex].lessons.filter((_, i) => i !== lessonIndex);
    setCourse({ ...course, sections: newSections });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token'); // Adjust if token is stored elsewhere
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      if (id) {
        await axios.put(`http://localhost:5000/api/courses/admin/courses/${id}`, course, config);
      } else {
        await axios.post('http://localhost:5000/api/courses/admin/courses', course, config);
      }
      alert('Course saved successfully!');
      navigate('/courses');
    } catch (error) {
      console.error('Error saving course:', error);
      alert('Failed to save course.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow mb-10">
      <h2 className="text-2xl font-bold mb-6">{id ? 'Edit Course' : 'Add New Course'}</h2>

      {/* Progress bar */}
      <div className="mb-8">
        <div className="flex justify-between mb-2">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <button
              key={i}
              onClick={() => setStep(i + 1)}
              className={`w-10 h-10 rounded-full flex items-center justify-center ${
                step > i ? 'bg-teal-600 text-white' :
                step === i + 1 ? 'border-2 border-teal-600 text-teal-600' :
                'bg-gray-200 text-gray-600'
              } transition-all duration-300`}
            >
              {i + 1}
            </button>
          ))}
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <motion.div
            className="bg-teal-600 h-2 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${(step / totalSteps) * 100}%` }}
            transition={{ duration: 0.5 }}
          ></motion.div>
        </div>
        <div className="mt-2 text-sm text-gray-600 text-center">
          Step {step} of {totalSteps}: {
            step === 1 ? 'Basic Information' :
            step === 2 ? 'Instructor Details' :
            step === 3 ? 'Course Curriculum' :
            step === 4 ? 'Learning Outcomes' :
            'Quiz Questions'
          }
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <AnimatePresence mode="wait" custom={step}>
          <motion.div
            key={step}
            custom={step}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            {step === 1 && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold pb-2 border-b">Basic Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <label className="block text-sm font-medium mb-1">Course Title</label>
                    <input
                      type="text"
                      value={course.title}
                      onChange={(e) => setCourse({ ...course, title: e.target.value })}
                      className="w-full p-2 border rounded focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                      required
                    />
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <label className="block text-sm font-medium mb-1">Short Description</label>
                    <textarea
                      value={course.description}
                      onChange={(e) => setCourse({ ...course, description: e.target.value })}
                      className="w-full p-2 border rounded focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                      rows={3}
                      required
                    />
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <label className="block text-sm font-medium mb-1">Long Description</label>
                    <textarea
                      value={course.longDescription}
                      onChange={(e) => setCourse({ ...course, longDescription: e.target.value })}
                      className="w-full p-2 border rounded focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                      rows={4}
                    />
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <label className="block text-sm font-medium mb-1">Thumbnail Image</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={async (e) => {
                        const file = e.target.files[0];
                        if (file) {
                          // Show preview locally
                          const previewUrl = URL.createObjectURL(file);
                          setCourse({ ...course, thumbnail: previewUrl });

                          // Upload to server
                          const formData = new FormData();
                          formData.append('image', file);
                          try {
                            const token = localStorage.getItem('token');
                            const response = await fetch('/api/upload/image', {
                              method: 'POST',
                              headers: {
                                Authorization: `Bearer ${token}`,
                              },
                              body: formData,
                            });
                            if (!response.ok) {
                              throw new Error('Image upload failed');
                            }
                            const data = await response.json();
                            // Prepend backend base URL to image URL
                            const backendBaseUrl = 'http://localhost:5000';
                            const fullUrl = data.url.startsWith('http') ? data.url : backendBaseUrl + data.url;
                            setCourse((prev) => ({ ...prev, thumbnail: fullUrl }));
                          } catch (error) {
                            alert('Failed to upload image');
                          }
                        }
                      }}
                      className="w-full p-2 border rounded focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                    />
                    {course.thumbnail && (
                      <img
                        src={course.thumbnail}
                        alt="Thumbnail Preview"
                        className="mt-2 max-h-40 object-contain rounded"
                      />
                    )}
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <label className="block text-sm font-medium mb-1">Duration</label>
                    <input
                      type="text"
                      value={course.duration}
                      onChange={(e) => setCourse({ ...course, duration: e.target.value })}
                      className="w-full p-2 border rounded focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                    />
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                  >
                    <label className="block text-sm font-medium mb-1">Level</label>
                    <select
                      value={course.level}
                      onChange={(e) => setCourse({ ...course, level: e.target.value })}
                      className="w-full p-2 border rounded focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                    >
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                    </select>
                  </motion.div>

                  <motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: 0.65 }}
>
  <label className="block text-sm font-medium mb-1">Category</label>
  <select
    value={course.category}
    onChange={(e) => setCourse({ ...course, category: e.target.value })}
    className="w-full p-2 border rounded focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
    required
  >
    <option value="">Select Category</option>
    <option value="Blockchain">Blockchain</option>
    <option value="Web Development">Web Development</option>
    <option value="Design">Design</option>
    <option value="AI">AI</option>
    {/* Add more as needed */}
  </select>
</motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                  >

                    <label className="block text-sm font-medium mb-1">Price (USD)</label>
                    <input
                      type="number"
                      value={course.price}
                      onChange={(e) => setCourse({ ...course, price: Number(e.target.value) })}
                      className="w-full p-2 border rounded focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                      min={0}
                    />
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                  >
                    <label className="block text-sm font-medium mb-1">Lesson Count</label>
                    <input
                      type="number"
                      value={course.lessonCount}
                      onChange={(e) => setCourse({ ...course, lessonCount: Number(e.target.value) })}
                      className="w-full p-2 border rounded focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                      min={0}
                    />
                  </motion.div>
                </div>
              </div>
            )}
            {step === 2 && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold pb-2 border-b">Instructor Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <label className="block text-sm font-medium mb-1">Name</label>
                    <input
                      type="text"
                      value={course.instructor.name}
                      onChange={(e) =>
                        setCourse({
                          ...course,
                          instructor: { ...course.instructor, name: e.target.value }
                        })
                      }
                      className="w-full p-2 border rounded focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                      required
                    />
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <label className="block text-sm font-medium mb-1">Title</label>
                    <input
                      type="text"
                      value={course.instructor.title}
                      onChange={(e) =>
                        setCourse({
                          ...course,
                          instructor: { ...course.instructor, title: e.target.value }
                        })
                      }
                      className="w-full p-2 border rounded focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                    />
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <label className="block text-sm font-medium mb-1">Bio</label>
                    <textarea
                      value={course.instructor.bio}
                      onChange={(e) =>
                        setCourse({
                          ...course,
                          instructor: { ...course.instructor, bio: e.target.value }
                        })
                      }
                      className="w-full p-2 border rounded focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                      rows={4}
                    />
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <label className="block text-sm font-medium mb-1">Instructor Avatar</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={async (e) => {
                        const file = e.target.files[0];
                        if (file) {
                          // Show preview locally
                          const previewUrl = URL.createObjectURL(file);
                          setCourse((prev) => ({
                            ...prev,
                            instructor: { ...prev.instructor, avatar: previewUrl }
                          }));

                          // Upload to server
                          const formData = new FormData();
                          formData.append('image', file);
                          try {
                            const token = localStorage.getItem('token');
                            const response = await fetch('/api/upload/image', {
                              method: 'POST',
                              headers: {
                                Authorization: `Bearer ${token}`,
                              },
                              body: formData,
                            });
                            if (!response.ok) {
                              throw new Error('Image upload failed');
                            }
                            const data = await response.json();
                            // Prepend backend base URL to image URL
                            const backendBaseUrl = 'http://localhost:5000';
                            const fullUrl = data.url.startsWith('http') ? data.url : backendBaseUrl + data.url;
                            setCourse((prev) => ({
                              ...prev,
                              instructor: { ...prev.instructor, avatar: fullUrl }
                            }));
                          } catch (error) {
                            alert('Failed to upload image');
                          }
                        }
                      }}
                      className="w-full p-2 border rounded focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                    />
                    {course.instructor.avatar && (
                      <img
                        src={course.instructor.avatar}
                        alt="Instructor Avatar Preview"
                        className="mt-2 max-h-40 object-contain rounded"
                      />
                    )}
                  </motion.div>
                </div>
              </div>
            )}
            {step === 3 && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold pb-2 border-b">Course Curriculum</h3>
                {course.sections.map((section, sectionIndex) => (
                  <div key={sectionIndex} className="mb-6 p-4 border rounded">
                    <div className="flex justify-between items-center mb-4">
                      <input
                        type="text"
                        value={section.title}
                        onChange={(e) => handleSectionChange(sectionIndex, 'title', e.target.value)}
                        placeholder="Section Title"
                        className="w-2/3 p-2 border rounded focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                      />
                      <input
                        type="text"
                        value={section.duration}
                        onChange={(e) => handleSectionChange(sectionIndex, 'duration', e.target.value)}
                        placeholder="Duration"
                        className="w-1/3 p-2 border rounded focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => removeSection(sectionIndex)}
                        className="ml-4 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                      >
                        Remove Section
                      </button>
                    </div>
                    {section.lessons.map((lesson, lessonIndex) => (
                      <div key={lessonIndex} className="mb-4 p-3 border rounded">
                        <div className="flex justify-between items-center mb-2">
                          <input
                            type="text"
                            value={lesson.title}
                            onChange={(e) =>
                              handleLessonChange(sectionIndex, lessonIndex, 'title', e.target.value)
                            }
                            placeholder="Lesson Title"
                            className="w-2/5 p-2 border rounded focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                          />
                          <select
                            value={lesson.type}
                            onChange={(e) =>
                              handleLessonChange(sectionIndex, lessonIndex, 'type', e.target.value)
                            }
                            className="w-1/5 p-2 border rounded focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                          >
                            <option value="video">Video</option>
                            <option value="quiz">Quiz</option>
                            <option value="text">Text</option>
                          </select>
                          <input
                            type="text"
                            value={lesson.duration}
                            onChange={(e) =>
                              handleLessonChange(sectionIndex, lessonIndex, 'duration', e.target.value)
                            }
                            placeholder="Duration"
                            className="w-1/5 p-2 border rounded focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                          />
                          <button
                            type="button"
                            onClick={() => removeLesson(sectionIndex, lessonIndex)}
                            className="ml-4 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                          >
                            Remove Lesson
                          </button>
                        </div>
                        <textarea
                          value={lesson.content}
                          onChange={(e) =>
                            handleLessonChange(sectionIndex, lessonIndex, 'content', e.target.value)
                          }
                          placeholder="Lesson Content"
                          className="w-full p-2 border rounded focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                          rows={3}
                        />
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => addLesson(sectionIndex)}
                      className="px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700 transition-colors"
                    >
                      Add Lesson
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addSection}
                  className="px-6 py-2 bg-teal-600 text-white rounded hover:bg-teal-700 transition-colors"
                >
                  Add Section
                </button>
              </div>
            )}
            {step === 4 && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold pb-2 border-b">Learning Outcomes & Requirements</h3>
                <div>
                  <h4 className="font-medium mb-2">Learning Outcomes</h4>
                  {course.outcomes.map((outcome, index) => (
                    <div key={index} className="flex items-center mb-2">
                      <input
                        type="text"
                        value={outcome}
                        onChange={(e) => handleOutcomeChange(index, e.target.value)}
                        className="flex-grow p-2 border rounded focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => removeOutcome(index)}
                        className="ml-2 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addOutcome}
                    className="px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700 transition-colors"
                  >
                    Add Outcome
                  </button>
                </div>
                <div className="mt-6">
                  <h4 className="font-medium mb-2">Requirements</h4>
                  {course.requirements.map((requirement, index) => (
                    <div key={index} className="flex items-center mb-2">
                      <input
                        type="text"
                        value={requirement}
                        onChange={(e) => handleRequirementChange(index, e.target.value)}
                        className="flex-grow p-2 border rounded focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => removeRequirement(index)}
                        className="ml-2 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addRequirement}
                    className="px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700 transition-colors"
                  >
                    Add Requirement
                  </button>
                </div>
              </div>
            )}
            {step === 5 && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold pb-2 border-b">Quiz Questions</h3>
                {course.quizQuestions.map((question, index) => (
                  <div key={index} className="mb-6 p-4 border rounded">
                    <label className="block mb-2 font-medium">Question {index + 1}</label>
                    <input
                      type="text"
                      value={question.question}
                      onChange={(e) => handleQuizQuestionChange(index, 'question', e.target.value)}
                      className="w-full p-2 border rounded focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                      required
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      {question.options.map((option, optIndex) => (
                        <input
                          key={optIndex}
                          type="text"
                          value={option}
                          onChange={(e) =>
                            handleQuizQuestionChange(index, `option${optIndex}`, e.target.value)
                          }
                          className="p-2 border rounded focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                          placeholder={`Option ${optIndex + 1}`}
                          required
                        />
                      ))}
                    </div>
                    <label className="block mt-4 font-medium">Correct Answer</label>
                    <select
                      value={question.correctAnswer}
                      onChange={(e) => handleQuizQuestionChange(index, 'correctAnswer', e.target.value)}
                      className="w-full p-2 border rounded focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                    >
                      {question.options.map((_, optIndex) => (
                        <option key={optIndex} value={optIndex}>
                          Option {optIndex + 1}
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={() => removeQuizQuestion(index)}
                      className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                    >
                      Remove Question
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addQuizQuestion}
                  className="px-6 py-2 bg-teal-600 text-white rounded hover:bg-teal-700 transition-colors"
                >
                  Add Question
                </button>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        <div className="flex justify-between mt-8">
          <motion.button
            type="button"
            onClick={prevStep}
            className={`px-6 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 flex items-center transition-all ${
              step === 1 ? 'opacity-0' : 'opacity-100'
            }`}
            disabled={step === 1}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
            </svg>
            Previous
          </motion.button>

          <motion.button
            type={step === totalSteps ? 'submit' : 'button'}
            onClick={(e) => {
              if (step !== totalSteps) {
                e.preventDefault();
                nextStep();
              }
            }}
            className="px-6 py-2 bg-teal-600 text-white rounded hover:bg-teal-700 flex items-center transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {step === totalSteps ? 'Save Course' : 'Next Step'}
            {step !== totalSteps && (
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
              </svg>
            )}
          </motion.button>
        </div>
      </form>
    </div>
  );
}
