import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const MyHackathons = () => {
  const [hackathons, setHackathons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMyHackathons = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/hackathons/my', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        setHackathons(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch your hackathons');
        setLoading(false);
      }
    };

    fetchMyHackathons();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-600 text-center mt-8">{error}</div>
    );
  }

  if (hackathons.length === 0) {
    return (
      <div className="text-center mt-8 text-gray-600">
        You have not created or joined any hackathons yet.
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">My Hackathons</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {hackathons.map(hackathon => (
          <div key={hackathon._id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
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
    </div>
  );
};

export default MyHackathons;
