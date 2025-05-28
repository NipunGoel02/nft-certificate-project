import React, { useState, useEffect } from 'react';
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
        const config = {
          headers: {
            Authorization: `Bearer ${token}`
          }
        };
        const response = await axios.get('/api/hackathons/organizer/submissions', config);
        setSubmissions(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch submissions');
        setLoading(false);
      }
    };

    fetchSubmissions();
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

  if (submissions.length === 0) {
    return (
      <div className="text-center mt-8 text-gray-600">
        No submissions found for your hackathons.
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Submissions</h1>
      <div className="bg-white rounded-xl shadow-md p-6 overflow-x-auto">
        <table className="min-w-full table-auto">
          <thead>
            <tr className="bg-teal-600 text-white">
              <th className="px-4 py-2">Title</th>
              <th className="px-4 py-2">Description</th>
              <th className="px-4 py-2">Project URL</th>
              <th className="px-4 py-2">Demo URL</th>
              <th className="px-4 py-2">Tech Stack</th>
              <th className="px-4 py-2">Challenges</th>
              <th className="px-4 py-2">Submitted At</th>
              <th className="px-4 py-2">Hackathon</th>
            </tr>
          </thead>
          <tbody>
            {submissions.map((submission) => (
              <tr key={submission._id} className="border-b">
                <td className="px-4 py-2">{submission.title}</td>
                <td className="px-4 py-2">{submission.description}</td>
                <td className="px-4 py-2">
                  <a href={submission.projectUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    Link
                  </a>
                </td>
                <td className="px-4 py-2">
                  {submission.demoUrl ? (
                    <a href={submission.demoUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                      Link
                    </a>
                  ) : (
                    'N/A'
                  )}
                </td>
                <td className="px-4 py-2">{submission.techStack}</td>
                <td className="px-4 py-2">{submission.challenges}</td>
                <td className="px-4 py-2">{new Date(submission.submittedAt).toLocaleString()}</td>
                <td className="px-4 py-2">{submission.hackathonTitle}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrganizerSubmissions;
