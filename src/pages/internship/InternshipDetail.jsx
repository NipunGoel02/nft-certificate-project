import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const InternshipDetail = () => {
  const { id } = useParams();
  const [internship, setInternship] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInternship = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('/api/internships/' + id, {
          headers: {
            Authorization: 'Bearer ' + token
          }
        });
        setInternship(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch internship details');
        setLoading(false);
      }
    };
    fetchInternship();
  }, [id]);

  if (loading) return <div>Loading internship details...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{internship.title}</h1>
      <p>{internship.description}</p>
      <p>
        <strong>Start Date:</strong> {new Date(internship.startDate).toLocaleString()}
      </p>
      <p>
        <strong>End Date:</strong> {new Date(internship.endDate).toLocaleString()}
      </p>
      <p>
        <strong>Organizer:</strong> {internship.organizer?.name} ({internship.organizer?.email})
      </p>
    </div>
  );
};

export default InternshipDetail;
