// pages/hackathon/SubmitProject.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';

const SubmitProject = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [hackathon, setHackathon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    projectUrl: '',
    demoUrl: '',
    techStack: '',
    challenges: '',
    screenshots: ['']
  });

  useEffect(() => {
    const fetchHackathon = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const config = {
          headers: {
            Authorization: `Bearer ${token}`
          }
        };
        const response = await axios.get(`/api/hackathons/${id}`, config);
        setHackathon(response.data);
        
        // Check if user already has a submission
        const submissionResponse = await axios.get(`/api/hackathons/${id}/submissions/my`, config);
        if (submissionResponse.data) {
          setFormData(submissionResponse.data);
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching hackathon:', error);
        setError('Failed to load hackathon details');
        setLoading(false);
      }
    };

    fetchHackathon();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleScreenshotChange = (index, value) => {
    const updatedScreenshots = [...formData.screenshots];
    updatedScreenshots[index] = value;
    setFormData({ ...formData, screenshots: updatedScreenshots });
  };

  const addScreenshot = () => {
    setFormData({ ...formData, screenshots: [...formData.screenshots, ''] });
  };

  const removeScreenshot = (index) => {
    const updatedScreenshots = formData.screenshots.filter((_, i) => i !== index);
    setFormData({ ...formData, screenshots: updatedScreenshots });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      setError(null);
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };
      await axios.post(`/api/hackathons/${id}/submissions`, formData, config);
      setSubmitting(false);
      navigate(`/hackathons/${id}`);
    } catch (error) {
      setSubmitting(false);
      setError(error.response?.data?.message || 'Failed to submit project');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 text-red-700 p-4 rounded-lg">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-lg p-6"
      >
        <h1 className="text-2xl font-bold mb-6">Submit Project for {hackathon?.title}</h1>
        
        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6">
            <p>{error}</p>
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Project Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            ></textarea>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-gray-700 mb-2">Project URL (GitHub, GitLab, etc.)</label>
              <input
                type="url"
                name="projectUrl"
                value={formData.projectUrl}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                required
              />
            </div>
            
            <div>
              <label className="block text-gray-700 mb-2">Demo URL (Optional)</label>
              <input
                type="url"
                name="demoUrl"
                value={formData.demoUrl}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Tech Stack (comma separated)</label>
            <input
              type="text"
              name="techStack"
              value={formData.techStack}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="React, Node.js, MongoDB, etc."
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Challenges Faced</label>
            <textarea
              name="challenges"
              value={formData.challenges}
              onChange={handleChange}
              rows="3"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            ></textarea>
          </div>
          
          <div className="mb-6">
            <label className="block text-gray-700 mb-2">Screenshots (URLs)</label>
            
            {formData.screenshots.map((screenshot, index) => (
              <div key={index} className="flex items-center mb-2">
                <input
                  type="url"
                  value={screenshot}
                  onChange={(e) => handleScreenshotChange(index, e.target.value)}
                  className="flex-grow px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="https://example.com/screenshot.png"
                />
                
                <button
                  type="button"
                  onClick={() => removeScreenshot(index)}
                  className="ml-2 text-red-500 hover:text-red-700"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                  </svg>
                </button>
              </div>
            ))}
            
            <button
              type="button"
              onClick={addScreenshot}
              className="mt-2 text-blue-600 hover:text-blue-800 flex items-center"
            >
              <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
              </svg>
              Add Screenshot
            </button>
          </div>
          
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg flex items-center"
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Submitting...
                </>
              ) : (
                'Submit Project'
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default SubmitProject;
 