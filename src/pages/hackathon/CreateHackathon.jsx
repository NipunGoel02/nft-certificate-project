// pages/hackathon/CreateHackathon.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';

const CreateHackathon = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    submissionDeadline: '',
    isTeamEvent: true,
    minTeamSize: 1,
    maxTeamSize: 4,
    rules: [''],
    prizes: [{ rank: '', prize: '', amount: 0 }],
    judgingCriteria: [{ name: '', description: '', weightage: 10 }],
    banner: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleRuleChange = (index, value) => {
    const updatedRules = [...formData.rules];
    updatedRules[index] = value;
    setFormData({ ...formData, rules: updatedRules });
  };

  const addRule = () => {
    setFormData({ ...formData, rules: [...formData.rules, ''] });
  };

  const removeRule = (index) => {
    const updatedRules = formData.rules.filter((_, i) => i !== index);
    setFormData({ ...formData, rules: updatedRules });
  };

  const handlePrizeChange = (index, field, value) => {
    const updatedPrizes = [...formData.prizes];
    updatedPrizes[index] = { ...updatedPrizes[index], [field]: value };
    setFormData({ ...formData, prizes: updatedPrizes });
  };

  const addPrize = () => {
    setFormData({ 
      ...formData, 
      prizes: [...formData.prizes, { rank: '', prize: '', amount: 0 }] 
    });
  };

  const removePrize = (index) => {
    const updatedPrizes = formData.prizes.filter((_, i) => i !== index);
    setFormData({ ...formData, prizes: updatedPrizes });
  };

  const handleCriteriaChange = (index, field, value) => {
    const updatedCriteria = [...formData.judgingCriteria];
    updatedCriteria[index] = { ...updatedCriteria[index], [field]: value };
    setFormData({ ...formData, judgingCriteria: updatedCriteria });
  };

  const addCriteria = () => {
    setFormData({
      ...formData,
      judgingCriteria: [...formData.judgingCriteria, { name: '', description: '', weightage: 10 }]
    });
  };

  const removeCriteria = (index) => {
    const updatedCriteria = formData.judgingCriteria.filter((_, i) => i !== index);
    setFormData({ ...formData, judgingCriteria: updatedCriteria });
  };

  const nextStep = () => {
    setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem('token');
      const response = await axios.post('/api/hackathons', formData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setLoading(false);
      navigate(`/hackathons/${response.data._id}`);
    } catch (error) {
      setLoading(false);
      setError(error.response?.data?.message || 'Failed to create hackathon');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 to-white">
      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">Create Hackathon</h1>
          <p className="text-gray-600">Set up your hackathon event and invite participants</p>
        </motion.div>
        
        <div className="mb-8">
          <div className="flex items-center">
            {[1, 2, 3, 4].map((step) => (
              <React.Fragment key={step}>
                <div 
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    currentStep >= step ? 'bg-teal-500 text-white shadow-md' : 'bg-gray-200 text-gray-600'
                  } transition-all duration-300`}
                >
                  {step}
                </div>
                {step < 4 && (
                  <div 
                    className={`h-1 w-16 md:w-24 ${
                      currentStep > step ? 'bg-teal-500' : 'bg-gray-200'
                    } transition-all duration-300`}
                  ></div>
                )}
              </React.Fragment>
            ))}
          </div>
          <div className="flex justify-between mt-2">
            <span className="text-sm">Basic Details</span>
            <span className="text-sm">Rules & Criteria</span>
            <span className="text-sm">Prizes</span>
            <span className="text-sm">Review</span>
          </div>
        </div>
        
        <motion.div 
          className="bg-white rounded-xl shadow-lg p-6 md:p-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {currentStep === 1 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-xl font-semibold mb-6 text-gray-800">Basic Details</h2>
              
              <div className="mb-6">
                <label className="block text-gray-700 mb-2 font-medium">Hackathon Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 focus:outline-none transition-all duration-300"
                  required
                />
              </div>
              
              <div className="mb-6">
                <label className="block text-gray-700 mb-2 font-medium">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="4"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 focus:outline-none transition-all duration-300"
                  required
                ></textarea>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-gray-700 mb-2 font-medium">Start Date</label>
                  <input
                    type="datetime-local"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 focus:outline-none transition-all duration-300"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 mb-2 font-medium">End Date</label>
                  <input
                    type="datetime-local"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 focus:outline-none transition-all duration-300"
                    required
                  />
                </div>
              </div>
              
              <div className="mb-6">
                <label className="block text-gray-700 mb-2 font-medium">Submission Deadline</label>
                <input
                  type="datetime-local"
                  name="submissionDeadline"
                  value={formData.submissionDeadline}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 focus:outline-none transition-all duration-300"
                  required
                />
              </div>
              
              <div className="mb-6">
                <label className="block text-gray-700 mb-2 font-medium">Team Event</label>
                <div className="flex space-x-4">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="isTeamEvent"
                      value="true"
                      checked={formData.isTeamEvent === true}
                      onChange={() => setFormData({ ...formData, isTeamEvent: true })}
                      className="form-radio h-5 w-5 text-teal-500"
                    />
                    <span className="ml-2">Yes</span>
                  </label>
                  
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="isTeamEvent"
                      value="false"
                      checked={formData.isTeamEvent === false}
                      onChange={() => setFormData({ ...formData, isTeamEvent: false })}
                      className="form-radio h-5 w-5 text-teal-500"
                    />
                    <span className="ml-2">No</span>
                  </label>
                </div>
              </div>
              
              {formData.isTeamEvent && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-gray-700 mb-2 font-medium">Min Team Size</label>
                    <input
                      type="number"
                      name="minTeamSize"
                      value={formData.minTeamSize}
                      onChange={handleChange}
                      min="1"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 focus:outline-none transition-all duration-300"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 mb-2 font-medium">Max Team Size</label>
                    <input
                      type="number"
                      name="maxTeamSize"
                      value={formData.maxTeamSize}
                      onChange={handleChange}
                      min="1"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 focus:outline-none transition-all duration-300"
                      required
                    />
                  </div>
                </div>
              )}
              
              <div className="mb-6">
                <label className="block text-gray-700 mb-2 font-medium">Banner Image URL (Optional)</label>
                <input
                  type="text"
                  name="banner"
                  value={formData.banner}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 focus:outline-none transition-all duration-300"
                  placeholder="https://example.com/banner.jpg"
                />
              </div>
              
              <div className="flex justify-end">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={nextStep}
                  className="bg-gradient-to-r from-teal-500 to-teal-400 hover:from-teal-600 hover:to-teal-500 text-white font-semibold py-3 px-8 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
                >
                  Next
                </motion.button>
              </div>
            </motion.div>
          )}
          
          {currentStep === 2 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-xl font-semibold mb-6 text-gray-800">Rules & Judging Criteria</h2>
              
              <div className="mb-8">
                <h3 className="font-medium text-gray-700 mb-4">Rules</h3>
                
                {formData.rules.map((rule, index) => (
                  <div key={index} className="flex items-center mb-3">
                    <input
                      type="text"
                      value={rule}
                      onChange={(e) => handleRuleChange(index, e.target.value)}
                      className="flex-grow px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 focus:outline-none transition-all duration-300"
                      placeholder={`Rule ${index + 1}`}
                      required
                    />
                    
                    <button
                      type="button"
                      onClick={() => removeRule(index)}
                      className="ml-2 text-red-500 hover:text-red-700 transition-colors duration-300"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                      </svg>
                    </button>
                  </div>
                ))}
                
                <button
                  type="button"
                  onClick={addRule}
                  className="mt-3 text-teal-600 hover:text-teal-800 flex items-center transition-colors duration-300"
                >
                  <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                  </svg>
                  Add Rule
                </button>
              </div>
              
              <div className="mb-6">
                <h3 className="font-medium text-gray-700 mb-4">Judging Criteria</h3>
                
                {formData.judgingCriteria.map((criteria, index) => (
                  <div key={index} className="bg-teal-50 p-5 rounded-xl mb-4">
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="font-medium text-gray-800">Criterion #{index + 1}</h4>
                      <button
                        type="button"
                        onClick={() => removeCriteria(index)}
                        className="text-red-500 hover:text-red-700 transition-colors duration-300"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                        </svg>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                      <div>
                        <label className="block text-gray-700 text-sm font-medium mb-1">Name</label>
                        <input
                          type="text"
                          value={criteria.name}
                          onChange={(e) => handleCriteriaChange(index, 'name', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 focus:outline-none transition-all duration-300"
                          placeholder="e.g., Innovation, Technical Complexity"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-gray-700 text-sm font-medium mb-1">Weightage (out of 10)</label>
                        <input
                          type="number"
                          value={criteria.weightage}
                          onChange={(e) => handleCriteriaChange(index, 'weightage', parseInt(e.target.value))}
                          min="1"
                          max="10"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 focus:outline-none transition-all duration-300"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-1">Description</label>
                      <textarea
                        value={criteria.description}
                        onChange={(e) => handleCriteriaChange(index, 'description', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 focus:outline-none transition-all duration-300"
                        placeholder="Describe what judges should look for"
                        rows="2"
                      ></textarea>
                    </div>
                  </div>
                ))}
                
                <button
                  type="button"
                  onClick={addCriteria}
                  className="mt-3 text-teal-600 hover:text-teal-800 flex items-center transition-colors duration-300"
                >
                  <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                  </svg>
                  Add Criterion
                </button>
              </div>
              
              <div className="flex justify-between mt-8">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={prevStep}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-8 rounded-lg transition-all duration-300"
                >
                  Back
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={nextStep}
                  className="bg-gradient-to-r from-teal-500 to-teal-400 hover:from-teal-600 hover:to-teal-500 text-white font-semibold py-3 px-8 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
                >
                  Next
                </motion.button>
              </div>
            </motion.div>
          )}
          
          {currentStep === 3 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-xl font-semibold mb-6 text-gray-800">Prizes & Rewards</h2>
              
              {formData.prizes.map((prize, index) => (
                <div key={index} className="bg-teal-50 p-5 rounded-xl mb-4">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="font-medium text-gray-800">Prize #{index + 1}</h4>
                    <button
                      type="button"
                      onClick={() => removePrize(index)}
                      className="text-red-500 hover:text-red-700 transition-colors duration-300"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                      </svg>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-1">Rank/Position</label>
                      <input
                        type="text"
                        value={prize.rank}
                        onChange={(e) => handlePrizeChange(index, 'rank', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 focus:outline-none transition-all duration-300"
                        placeholder="e.g., 1st Place, Best UI"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-1">Prize Description</label>
                      <input
                        type="text"
                        value={prize.prize}
                        onChange={(e) => handlePrizeChange(index, 'prize', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 focus:outline-none transition-all duration-300"
                        placeholder="e.g., Amazon Gift Card, Cash Prize"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-1">Amount (if applicable)</label>
                      <input
                        type="number"
                        value={prize.amount}
                        onChange={(e) => handlePrizeChange(index, 'amount', parseInt(e.target.value))}
                        min="0"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 focus:outline-none transition-all duration-300"
                        placeholder="0"
                      />
                    </div>
                  </div>
                </div>
              ))}
              
              <button
                type="button"
                onClick={addPrize}
                className="mb-8 text-teal-600 hover:text-teal-800 flex items-center transition-colors duration-300"
              >
                <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                </svg>
                Add Prize
              </button>
              
              <div className="flex justify-between mt-8">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={prevStep}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-8 rounded-lg transition-all duration-300"
                >
                  Back
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={nextStep}
                  className="bg-gradient-to-r from-teal-500 to-teal-400 hover:from-teal-600 hover:to-teal-500 text-white font-semibold py-3 px-8 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
                >
                  Next
                </motion.button>
              </div>
            </motion.div>
          )}
          
          {currentStep === 4 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-xl font-semibold mb-6 text-gray-800">Review & Create</h2>
              
              {error && (
                <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-r-lg">
                  <p>{error}</p>
                </div>
              )}
              
              <div className="bg-teal-50 p-6 rounded-xl mb-6">
                <h3 className="font-semibold text-gray-800 mb-4">Basic Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                  <div>
                    <p className="text-sm text-gray-500">Title</p>
                    <p className="font-medium">{formData.title}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Team Event</p>
                    <p className="font-medium">{formData.isTeamEvent ? 'Yes' : 'No'}</p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-sm text-gray-500">Description</p>
                    <p className="font-medium">{formData.description}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Start Date</p>
                    <p className="font-medium">{formatDate(formData.startDate)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">End Date</p>
                    <p className="font-medium">{formatDate(formData.endDate)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Submission Deadline</p>
                    <p className="font-medium">{formatDate(formData.submissionDeadline)}</p>
                  </div>
                  {formData.isTeamEvent && (
                    <>
                      <div>
                        <p className="text-sm text-gray-500">Team Size</p>
                        <p className="font-medium">{formData.minTeamSize} - {formData.maxTeamSize} members</p>
                      </div>
                    </>
                  )}
                </div>
              </div>
              
              <div className="bg-teal-50 p-6 rounded-xl mb-6">
                <h3 className="font-semibold text-gray-800 mb-4">Rules</h3>
                <ul className="list-disc pl-5 space-y-2">
                  {formData.rules.map((rule, index) => (
                    <li key={index} className="text-gray-700">{rule}</li>
                  ))}
                </ul>
              </div>
              
              <div className="bg-teal-50 p-6 rounded-xl mb-6">
                <h3 className="font-semibold text-gray-800 mb-4">Judging Criteria</h3>
                <div className="space-y-4">
                  {formData.judgingCriteria.map((criteria, index) => (
                    <div key={index} className="border-b border-teal-100 pb-3 last:border-b-0 last:pb-0">
                      <div className="flex justify-between">
                        <h4 className="font-medium text-gray-800">{criteria.name}</h4>
                        <span className="text-teal-700 font-medium">{criteria.weightage}/10</span>
                      </div>
                      {criteria.description && <p className="text-sm text-gray-600 mt-1">{criteria.description}</p>}
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="bg-teal-50 p-6 rounded-xl mb-6">
                <h3 className="font-semibold text-gray-800 mb-4">Prizes</h3>
                <div className="space-y-4">
                  {formData.prizes.map((prize, index) => (
                    <div key={index} className="border-b border-teal-100 pb-3 last:border-b-0 last:pb-0">
                      <div className="flex justify-between">
                        <h4 className="font-medium text-gray-800">{prize.rank}</h4>
                        <span className="text-teal-700 font-medium">
                          {prize.amount > 0 ? `$${prize.amount}` : ''}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{prize.prize}</p>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="flex justify-between mt-8">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={prevStep}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-8 rounded-lg transition-all duration-300"
                  disabled={loading}
                >
                  Back
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={handleSubmit}
                  className="bg-gradient-to-r from-teal-500 to-teal-400 hover:from-teal-600 hover:to-teal-500 text-white font-semibold py-3 px-8 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex items-center"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Creating...
                    </>
                  ) : (
                    'Create Hackathon'
                  )}
                </motion.button>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default CreateHackathon;
