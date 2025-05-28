import React, { useEffect, useState } from 'react';
import axios from 'axios';

const OrganizerSubmissions = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const response = await axios.get('/api/internships/organizer/submissions', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setSubmissions(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch submissions');
        setLoading(false);
      }
    };
    fetchSubmissions();
  }, []);

  if (loading) return <div>Loading submissions...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Internship Submissions</h1>
      {submissions.length === 0 ? (
        <p>No submissions found.</p>
      ) : (
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">Participant Name</th>
              <th className="py-2 px-4 border-b">Email</th>
              <th className="py-2 px-4 border-b">Internship Title</th>
              <th className="py-2 px-4 border-b">Details</th>
            </tr>
          </thead>
          <tbody>
            {submissions.map((submission) => (
              <tr key={submission._id}>
                <td className="py-2 px-4 border-b">{submission.user?.name || 'N/A'}</td>
                <td className="py-2 px-4 border-b">{submission.user?.email || 'N/A'}</td>
                <td className="py-2 px-4 border-b">{submission.internshipTitle}</td>
                <td className="py-2 px-4 border-b">{submission.details || 'N/A'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default OrganizerSubmissions;
