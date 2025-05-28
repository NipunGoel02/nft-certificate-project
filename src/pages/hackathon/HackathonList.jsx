// pages/hackathon/HackathonList.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';

const HackathonList = () => {
  const [hackathons, setHackathons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchHackathons = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/hackathons');
        setHackathons(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching hackathons:', error);
        setLoading(false);
      }
    };

    fetchHackathons();
  }, []);

  const filteredHackathons = hackathons.filter(hackathon => {
    const matchesFilter = filter === 'all' || hackathon.status === filter;
    const matchesSearch = hackathon.title.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="container mx-auto px-4 py-8 ">
      <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4 mt-12">
            <span className="bg-gradient-to-r from-primary-600 to-secondary-500 bg-clip-text text-transparent">
              Explore Hackathons
            </span>
          </h1>
          <p className="mt-4 text-gray-600 text-lg max-w-2xl mx-auto">
            Discover exciting hackathons, connect with like-minded individuals, and showcase your skills. Join us in building innovative solutions and making a difference!
          </p>
        </motion.div>

      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-grow">
          <input
            type="text"
            placeholder="Search for hackathons..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 focus:outline-none"
          />
          <svg className="w-5 h-5 text-gray-400 absolute left-3 top-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
        </div>
        
        <div className="relative">
          <select
            className="appearance-none w-full md:w-64 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 focus:outline-none"
            defaultValue="all"
          >
            <option value="all">All Categories</option>
            <option value="web">Web Development</option>
            <option value="blockchain">Blockchain</option>
            <option value="ai">Artificial Intelligence</option>
            <option value="design">Design</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <button 
          onClick={() => setFilter('all')}
          className={`mr-2 mb-2 px-4 py-2 rounded-full transition-all duration-300 ${
            filter === 'all' 
              ? 'bg-teal-500 text-white shadow-md' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          All
        </button>
        <button 
          onClick={() => setFilter('upcoming')}
          className={`mr-2 mb-2 px-4 py-2 rounded-full transition-all duration-300 ${
            filter === 'upcoming' 
              ? 'bg-teal-500 text-white shadow-md' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Upcoming
        </button>
        <button 
          onClick={() => setFilter('active')}
          className={`mr-2 mb-2 px-4 py-2 rounded-full transition-all duration-300 ${
            filter === 'active' 
              ? 'bg-teal-500 text-white shadow-md' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Active
        </button>
        <button 
          onClick={() => setFilter('completed')}
          className={`mr-2 mb-2 px-4 py-2 rounded-full transition-all duration-300 ${
            filter === 'completed' 
              ? 'bg-teal-500 text-white shadow-md' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Completed
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="relative w-16 h-16">
            <div className="absolute top-0 left-0 w-full h-full border-4 border-teal-200 rounded-full animate-ping"></div>
            <div className="absolute top-0 left-0 w-full h-full border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>
      ) : filteredHackathons.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl shadow-md">
          <svg className="w-16 h-16 mx-auto text-teal-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No hackathons found</h3>
          <p className="text-gray-500 max-w-md mx-auto">
            {searchTerm 
              ? `No results found for "${searchTerm}". Try a different search term.` 
              : `There are no ${filter !== 'all' ? filter : ''} hackathons available right now.`}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredHackathons.map(hackathon => (
            <div 
              key={hackathon._id}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              <div className="h-40 bg-gradient-to-r from-teal-500 to-teal-400 relative overflow-hidden">
                {hackathon.banner ? (
                  <img src={hackathon.banner} alt={hackathon.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-white text-xl font-bold px-4 text-center z-10">{hackathon.title}</div>
                  </div>
                )}
                <div className="absolute top-4 right-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    hackathon.status === 'active' ? 'bg-teal-100 text-teal-800' : 
                    hackathon.status === 'upcoming' ? 'bg-yellow-100 text-yellow-800' : 
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {hackathon.status}
                  </span>
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-2">{hackathon.title}</h3>
                <p className="text-gray-600 mb-4 line-clamp-2">{hackathon.description}</p>
                
                <div className="flex flex-col space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-500">
                    <svg className="w-4 h-4 mr-2 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                    </svg>
<span>{new Date(hackathon.startDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })} - {new Date(hackathon.endDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-500">
                    <svg className="w-4 h-4 mr-2 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                    </svg>
                    <span>{hackathon.participants?.length || 0} Participants</span>
                  </div>
                </div>
                
                <Link
                  to={`/hackathons/${hackathon._id}`}
                  className="block w-full text-center bg-teal-500 hover:bg-teal-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-300"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HackathonList;
