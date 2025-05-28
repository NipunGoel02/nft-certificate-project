import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const MyInternships = () => {
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInternships = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('/api/internships/organizer', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setInternships(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch internships');
        setLoading(false);
      }
    };
    fetchInternships();
  }, []);

  if (loading) return <div>Loading internships...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">My Internships</h1>
      {internships.length === 0 ? (
        <p>You have not created any internships yet.</p>
      ) : (
        <ul className="space-y-4">
          {internships.map((internship) => (
            <li key={internship._id} className="border p-4 rounded shadow">
              <h2 className="text-xl font-semibold">{internship.title}</h2>
              <p>{internship.description}</p>
              <p>
                <strong>Start Date:</strong> {new Date(internship.startDate).toLocaleString()}
              </p>
              <p>
                <strong>End Date:</strong> {new Date(internship.endDate).toLocaleString()}
              </p>
              <Link
                to={`/internships/${internship._id}`}
                className="text-blue-600 hover:underline mt-2 inline-block"
              >
                View Details
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MyInternships;
