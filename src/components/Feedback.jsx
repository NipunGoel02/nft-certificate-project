import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Feedback from './Feedback'; // Import the Feedback component

export default function CourseForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [course, setCourse] = useState({
    title: '',
    description: '',
    instructor: '',
    duration: '',
    level: 'beginner',
    tags: []
  });

  // Feedback state
  const [feedback, setFeedback] = useState({
    message: '',
    type: 'success',
    visible: false
  });

  // Feedback handlers
  const showFeedback = (message, type = 'success') => {
    setFeedback({
      message,
      type,
      visible: true
    });
  };

  const hideFeedback = () => {
    setFeedback(prev => ({
      ...prev,
      visible: false
    }));
  };

  // Load course data if editing
  useEffect(() => {
    if (id) {
      const fetchCourse = async () => {
        setIsLoading(true);
        try {
          const response = await axios.get(`/api/courses/${id}`);
          setCourse(response.data);
        } catch (error) {
          console.error('Failed to load course data:', error);
          showFeedback('Failed to load course data for editing.', 'error');
        } finally {
          setIsLoading(false);
        }
      };
      fetchCourse();
    }
  }, [id]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCourse(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle tag changes
  const handleTagChange = (e) => {
    const value = e.target.value;
    if (value.trim()) {
      const tagsArray = value.split(',').map(tag => tag.trim());
      setCourse(prev => ({
        ...prev,
        tags: tagsArray
      }));
    } else {
      setCourse(prev => ({
        ...prev,
        tags: []
      }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      if (id) {
        // Update existing course
        await axios.put(`/api/courses/${id}`, course);
        showFeedback('Course updated successfully!', 'success');
      } else {
        // Create new course
        await axios.post('/api/courses', course);
        showFeedback('Course created successfully!', 'success');
      }
      
      // Navigate after a short delay to allow the user to see the feedback
      setTimeout(() => {
        navigate('/courses');
      }, 1500);
    } catch (error) {
      console.error('Error saving course:', error);
      showFeedback('Failed to save course.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle course deletion
  const handleDelete = async () => {
    if (!id) return;
    
    if (window.confirm('Are you sure you want to delete this course?')) {
      setIsLoading(true);
      try {
        await axios.delete(`/api/courses/${id}`);
        showFeedback('Course deleted successfully!', 'success');
        
        // Navigate after a short delay
        setTimeout(() => {
          navigate('/courses');
        }, 1500);
      } catch (error) {
        console.error('Error deleting course:', error);
        showFeedback('Failed to delete course.', 'error');
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow mb-10">
      <h1 className="text-2xl font-bold mb-6">
        {id ? 'Edit Course' : 'Create New Course'}
      </h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title Field */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Course Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={course.title}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter course title"
          />
        </div>
        
        {/* Description Field */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={course.description}
            onChange={handleChange}
            rows="4"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter course description"
          ></textarea>
        </div>
        
        {/* Instructor Field */}
        <div>
          <label htmlFor="instructor" className="block text-sm font-medium text-gray-700 mb-1">
            Instructor
          </label>
          <input
            type="text"
            id="instructor"
            name="instructor"
            value={course.instructor}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter instructor name"
          />
        </div>
        
        {/* Duration Field */}
        <div>
          <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-1">
            Duration (hours)
          </label>
          <input
            type="number"
            id="duration"
            name="duration"
            value={course.duration}
            onChange={handleChange}
            min="0"
            step="0.1"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter course duration in hours"
          />
        </div>
        
        {/* Level Field */}
        <div>
          <label htmlFor="level" className="block text-sm font-medium text-gray-700 mb-1">
            Difficulty Level
          </label>
          <select
            id="level"
            name="level"
            value={course.level}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>
        
        {/* Tags Field */}
        <div>
          <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-1">
            Tags (comma separated)
          </label>
          <input
            type="text"
            id="tags"
            name="tags"
            value={course.tags.join(', ')}
            onChange={handleTagChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g. javascript, web development, programming"
          />
        </div>
        
        {/* Form Buttons */}
        <div className="flex justify-between pt-4">
          <button
            type="button"
            onClick={() => navigate('/courses')}
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Cancel
          </button>
          
          <div className="space-x-2">
            {id && (
              <button
                type="button"
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                disabled={isLoading}
              >
                {isLoading ? 'Processing...' : 'Delete'}
              </button>
            )}
            
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isLoading}
            >
              {isLoading ? 'Saving...' : (id ? 'Update Course' : 'Create Course')}
            </button>
          </div>
        </div>
      </form>
      
      {/* Feedback Component */}
      {feedback.visible && (
        <Feedback
          message={feedback.message}
          type={feedback.type}
          onClose={hideFeedback}
          duration={3000}
        />
      )}
    </div>
  );
}
