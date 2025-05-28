// components/hackathon/HackathonCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const HackathonCard = ({ hackathon }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'upcoming': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'active': return 'bg-teal-100 text-teal-800 border-teal-200';
      case 'completed': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-teal-100 text-teal-800 border-teal-200';
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <motion.div 
      variants={item}
      className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1"
    >
      <div className="h-48 bg-gradient-to-r from-teal-500 to-teal-400 relative overflow-hidden">
        {hackathon.banner ? (
          <img src={hackathon.banner} alt={hackathon.title} className="w-full h-full object-cover" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-white text-2xl font-bold px-4 text-center z-10">{hackathon.title}</div>
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
        <div className="absolute top-4 right-4">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(hackathon.status)}`}>
            {hackathon.status.charAt(0).toUpperCase() + hackathon.status.slice(1)}
          </span>
        </div>
      </div>
      
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-1">{hackathon.title}</h3>
        
        <p className="text-gray-600 mb-4 line-clamp-2">{hackathon.description}</p>
        
        <div className="flex flex-col space-y-3 mb-6">
          <div className="flex items-center text-sm text-gray-500">
            <svg className="w-4 h-4 mr-2 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
            </svg>
            <span>
              {formatDate(hackathon.startDate)} - {formatDate(hackathon.endDate)}
            </span>
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
          className="block w-full text-center bg-gradient-to-r from-teal-500 to-teal-400 hover:from-teal-600 hover:to-teal-500 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-[1.02]"
        >
          View Details
        </Link>
      </div>
    </motion.div>
  );
};

export default HackathonCard;
