import React, { useEffect, useState } from 'react';
import axios from 'axios';

const OrganizerCertificates = () => {
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCertificateType, setSelectedCertificateType] = useState('participation');

  useEffect(() => {
    const fetchParticipants = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const response = await axios.get('/api/internships/organizer/participants', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setParticipants(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch participants');
        setLoading(false);
      }
    };
    fetchParticipants();
  }, []);

  const handleGenerateCertificate = async (participantId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post('/api/internships/organizer/certificates/generate', {
        participantId,
        certificateType: selectedCertificateType
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Certificate generation request sent');
    } catch (err) {
      alert('Failed to send certificate request');
    }
  };

  if (loading) return <div>Loading participants...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Manage Internship Certificates</h1>

      <div className="mb-4">
        <label className="mr-2 font-medium">Certificate Type:</label>
        <select
          value={selectedCertificateType}
          onChange={(e) => setSelectedCertificateType(e.target.value)}
          className="border border-gray-300 rounded px-2 py-1"
        >
          <option value="participation">Participation</option>
          <option value="completion">Completion</option>
        </select>
      </div>

      {participants.length === 0 ? (
        <p>No participants found.</p>
      ) : (
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">Name</th>
              <th className="py-2 px-4 border-b">Email</th>
              <th className="py-2 px-4 border-b">Internship Title</th>
              <th className="py-2 px-4 border-b">Action</th>
            </tr>
          </thead>
          <tbody>
            {participants.map((participant) => (
              <tr key={participant._id}>
                <td className="py-2 px-4 border-b">{participant.name}</td>
                <td className="py-2 px-4 border-b">{participant.email}</td>
                <td className="py-2 px-4 border-b">{participant.internshipTitle}</td>
                <td className="py-2 px-4 border-b">
                  <button
                    onClick={() => handleGenerateCertificate(participant._id)}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  >
                    Generate Certificate
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default OrganizerCertificates;
