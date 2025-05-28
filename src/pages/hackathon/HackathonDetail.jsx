// pages/hackathon/HackathonDetails.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';

const HackathonDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [hackathon, setHackathon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const fetchHackathon = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/hackathons/${id}`);
        setHackathon(response.data);
        
        // Check if user is registered
        const token = localStorage.getItem('token');
        const userResponse = await axios.get('/api/auth/profile', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        // Debug logs
        console.log('Hackathon participants:', response.data.participants);
        console.log('Current user ID:', userResponse.data._id);
        // Fix: participants may be array of ObjectIds, convert to string for comparison
        const userId = userResponse.data._id;
        const userRole = userResponse.data.role;
        setUserRole(userRole);
        const participants = response.data.participants || [];
        const registered = participants.some(p => {
          if (typeof p === 'string') {
            return p === userId;
          } else if (p && typeof p === 'object' && p._id) {
            return p._id === userId;
          }
          return false;
        });
        console.log('Is user registered:', registered);
        setIsRegistered(registered);
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching hackathon:', error);
        setError('Failed to load hackathon details');
        setLoading(false);
      }
    };

    fetchHackathon();
  }, [id]);

  const handleRegister = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`/api/hackathons/${id}/register`, null, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setIsRegistered(true);
    } catch (error) {
      if (error.response && error.response.status === 400 && error.response.data.message === 'User already registered') {
        alert('You are already registered for this hackathon.');
        setIsRegistered(true);
      } else {
        console.error('Error registering for hackathon:', error);
      }
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-teal-50 to-white flex justify-center items-center">
        <div className="relative w-24 h-24">
          <div className="absolute top-0 left-0 w-full h-full border-8 border-teal-200 rounded-full animate-ping"></div>
          <div className="absolute top-0 left-0 w-full h-full border-8 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (error || !hackathon) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-teal-50 to-white">
        <div className="container mx-auto px-4 py-16">
          <div className="bg-white rounded-xl shadow-lg p-8 max-w-2xl mx-auto">
            <svg className="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">Error</h2>
            <p className="text-center text-gray-600">{error || 'Hackathon not found'}</p>
            <div className="mt-6 text-center">
              <Link to="/hackathons" className="text-teal-600 hover:text-teal-800 font-medium">
                Back to Hackathons
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 to-white">
      <div className="h-64 md:h-96 bg-gradient-to-r from-teal-500 to-teal-400 relative overflow-hidden">
        {hackathon.banner ? (
          <img src={hackathon.banner} alt={hackathon.title} className="w-full h-full object-cover" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-white text-4xl md:text-5xl font-bold px-4 text-center z-10 max-w-4xl">{hackathon.title}</div>
            <div className="absolute inset-0">
              <svg className="w-full h-full text-white opacity-10" viewBox="0 0 100 100" preserveAspectRatio="none">
                <path d="M0,0 L100,0 L100,100 L0,100 Z" fill="currentColor" />
                <path d="M0,0 L100,0 L50,100 Z" fill="currentColor" />
                <circle cx="80" cy="20" r="15" fill="currentColor" />
                <circle cx="20" cy="80" r="10" fill="currentColor" />
              </svg>
            </div>
          </div>
        )}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/50 to-transparent"></div>
      </div>
      
      <div className="container mx-auto px-4 -mt-10 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-xl overflow-hidden"
        >
          <div className="p-6 md:p-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
              <div>
                <div className="flex items-center mb-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold mr-3 ${
                    hackathon.status === 'active' ? 'bg-teal-100 text-teal-800' : 
                    hackathon.status === 'upcoming' ? 'bg-yellow-100 text-yellow-800' : 
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {hackathon.status.charAt(0).toUpperCase() + hackathon.status.slice(1)}
                  </span>
                  <span className="text-gray-500 text-sm">
                    {hackathon.participants?.length || 0} Participants
                  </span>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">{hackathon.title}</h1>
                <p className="text-gray-600 text-lg max-w-3xl">{hackathon.description}</p>
              </div>
              
              <div className="mt-6 md:mt-0 w-full md:w-auto">
                {isRegistered ? (
                  <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
                    <Link 
                      to={`/hackathons/${id}/submit`}
                      className="bg-gradient-to-r from-teal-500 to-teal-400 hover:from-teal-600 hover:to-teal-500 text-white font-semibold py-3 px-6 rounded-lg text-center shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      Submit Project
                    </Link>
                    {hackathon.isTeamEvent && (
                      <Link 
                        to={`/hackathons/${id}/team`}
                        className="bg-gradient-to-r from-teal-400 to-teal-300 hover:from-teal-500 hover:to-teal-400 text-white font-semibold py-3 px-6 rounded-lg text-center shadow-lg hover:shadow-xl transition-all duration-300"
                      >
                        Manage Team
                      </Link>
                    )}
                  </div>
                ) : (
                  <button
                    onClick={handleRegister}
                    className="bg-gradient-to-r from-teal-500 to-teal-400 hover:from-teal-600 hover:to-teal-500 text-white font-semibold py-3 px-8 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 w-full md:w-auto"
                    disabled={hackathon.status !== 'upcoming' && hackathon.status !== 'active' || userRole === 'admin' || userRole === 'hackathon organizer'}
                    title={userRole === 'admin' || userRole === 'hackathon organizer' ? 'Admins and Hackathon Organizers cannot register' : ''}
                  >
                    Register for Hackathon
                  </button>
                )}
              </div>
            </div>
            
            <div className="border-b border-gray-200 mb-8">
              <nav className="flex space-x-8 overflow-x-auto">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'overview'
                      ? 'border-teal-500 text-teal-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Overview
                </button>
                <button
                  onClick={() => setActiveTab('timeline')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'timeline'
                      ? 'border-teal-500 text-teal-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Timeline
                </button>
                <button
                  onClick={() => setActiveTab('rules')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'rules'
                      ? 'border-teal-500 text-teal-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Rules
                </button>
                <button
                  onClick={() => setActiveTab('prizes')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'prizes'
                      ? 'border-teal-500 text-teal-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Prizes
                </button>
                <button
                  onClick={() => setActiveTab('judging')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'judging'
                      ? 'border-teal-500 text-teal-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Judging Criteria
                </button>
              </nav>
            </div>
            
            {activeTab === 'overview' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="bg-teal-50 rounded-xl p-6">
                    <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
                      <svg className="w-5 h-5 mr-2 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                      </svg>
                      Timeline
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-gray-500">Registration Start</p>
                        <p className="font-medium">{formatDate(hackathon.startDate)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Submission Deadline</p>
                        <p className="font-medium">{formatDate(hackathon.submissionDeadline)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">End Date</p>
                        <p className="font-medium">{formatDate(hackathon.endDate)}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-teal-50 rounded-xl p-6">
                    <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
                      <svg className="w-5 h-5 mr-2 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                      </svg>
                      Team
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-gray-500">Team Event</p>
                        <p className="font-medium">{hackathon.isTeamEvent ? 'Yes' : 'No'}</p>
                      </div>
                      {hackathon.isTeamEvent && (
                        <>
                          <div>
                            <p className="text-sm text-gray-500">Min Team Size</p>
                            <p className="font-medium">{hackathon.minTeamSize}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Max Team Size</p>
                            <p className="font-medium">{hackathon.maxTeamSize}</p>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                  
                  <div className="bg-teal-50 rounded-xl p-6">
                    <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
                      <svg className="w-5 h-5 mr-2 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                      Participation
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-gray-500">Participants</p>
                        <p className="font-medium">{hackathon.participants?.length || 0}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Submissions</p>
                        <p className="font-medium">{hackathon.submissions?.length || 0}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Status</p>
                        <p className="font-medium capitalize">{hackathon.status}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
            
            {activeTab === 'rules' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <div className="bg-white p-6 rounded-lg">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">Rules & Guidelines</h3>
                  
                  <ul className="space-y-3 list-disc pl-5">
                    {hackathon.rules?.map((rule, index) => (
                      <li key={index} className="text-gray-600">{rule}</li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            )}
            
            {activeTab === 'prizes' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <div className="bg-white p-6 rounded-lg">
                  <h3 className="text-xl font-semibold text-gray-800 mb-6">Prizes</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {hackathon.prizes?.map((prize, index) => (
                      <div key={index} className="bg-teal-50 p-5 rounded-xl">
                        <h4 className="font-semibold text-teal-800 text-lg mb-2">{prize.rank}</h4>
                        <p className="text-gray-600 mb-2">{prize.prize}</p>
                        {prize.amount > 0 && (
                          <p className="text-teal-600 font-medium text-xl">${prize.amount}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
            
            {activeTab === 'judging' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <div className="bg-white p-6 rounded-lg">
                  <h3 className="text-xl font-semibold text-gray-800 mb-6">Judging Criteria</h3>
                  
                  <div className="space-y-4">
                    {hackathon.judgingCriteria?.map((criteria, index) => (
                      <div key={index} className="border-b border-gray-100 pb-4 last:border-b-0 last:pb-0">
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="font-semibold text-gray-800">{criteria.name}</h4>
                          <span className="bg-teal-100 text-teal-800 px-2 py-1 rounded-full text-xs font-medium">
                            {criteria.weightage}/10
                          </span>
                        </div>
                        {criteria.description && (
                          <p className="text-gray-600 text-sm">{criteria.description}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
            
            {activeTab === 'timeline' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <div className="bg-white p-6 rounded-lg">
                  <h3 className="text-xl font-semibold text-gray-800 mb-6">Event Timeline</h3>
                  
                  <div className="relative border-l-2 border-teal-200 pl-8 ml-4 space-y-10">
                    <div className="relative">
                      <div className="absolute -left-10 mt-1.5 h-6 w-6 rounded-full border-2 border-teal-500 bg-white flex items-center justify-center">
                        <div className="h-3 w-3 rounded-full bg-teal-500"></div>
                      </div>
                      <h4 className="text-lg font-semibold text-gray-800">Registration Opens</h4>
                      <p className="text-gray-600">{formatDate(hackathon.startDate)}</p>
                    </div>
                    
                    <div className="relative">
                      <div className="absolute -left-10 mt-1.5 h-6 w-6 rounded-full border-2 border-teal-500 bg-white flex items-center justify-center">
                        <div className="h-3 w-3 rounded-full bg-teal-500"></div>
                      </div>
                      <h4 className="text-lg font-semibold text-gray-800">Submission Deadline</h4>
                      <p className="text-gray-600">{formatDate(hackathon.submissionDeadline)}</p>
                    </div>
                    
                    <div className="relative">
                      <div className="absolute -left-10 mt-1.5 h-6 w-6 rounded-full border-2 border-teal-500 bg-white flex items-center justify-center">
                        <div className="h-3 w-3 rounded-full bg-teal-500"></div>
                      </div>
                      <h4 className="text-lg font-semibold text-gray-800">Judging Period</h4>
                      <p className="text-gray-600">
                        {formatDate(hackathon.submissionDeadline)} - {formatDate(hackathon.endDate)}
                      </p>
                    </div>
                    
                    <div className="relative">
                      <div className="absolute -left-10 mt-1.5 h-6 w-6 rounded-full border-2 border-teal-500 bg-white flex items-center justify-center">
                        <div className="h-3 w-3 rounded-full bg-teal-500"></div>
                      </div>
                      <h4 className="text-lg font-semibold text-gray-800">Results Announcement</h4>
                      <p className="text-gray-600">{formatDate(hackathon.endDate)}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default HackathonDetails;
