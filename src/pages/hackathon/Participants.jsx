import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Participants = () => {
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [certificateTypes, setCertificateTypes] = useState({});
  const [processingParticipantId, setProcessingParticipantId] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    const fetchParticipants = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/hackathons/organizer/participants', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
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

  const handleCertificateTypeChange = (participantId, value) => {
    setCertificateTypes(prev => ({ ...prev, [participantId]: value }));
  };

  // Accept the full participant object, not just the ID
  const handleGenerateCertificate = async (participant) => {
    const certificateType = certificateTypes[participant._id] || 'participation';
    setProcessingParticipantId(participant._id);
    setSuccessMessage(null);
    setErrorMessage(null);
    try {
      const token = localStorage.getItem('token');
      await axios.post('/api/hackathons/organizer/certificates/generate', {
        participantId: participant._id,
        hackathonId: participant.hackathonId, // Use backend-provided hackathonId
        certificateType: certificateType
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuccessMessage(`Certificate request sent`);
    } catch (err) {
      setErrorMessage(`Failed to send certificate request for `);
    } finally {
      setProcessingParticipantId(null);
    }
  };

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

  if (participants.length === 0) {
    return (
      <div className="text-center mt-8 text-gray-600">
        No participants found for your hackathons.
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Participants</h1>
      {successMessage && (
        <div className="bg-green-100 text-green-700 p-4 rounded mb-6">
          {successMessage}
        </div>
      )}
      {errorMessage && (
        <div className="bg-red-100 text-red-700 p-4 rounded mb-6">
          {errorMessage}
        </div>
      )}
      <div className="bg-white rounded-xl shadow-md p-6 overflow-x-auto">
        <table className="min-w-full table-auto">
          <thead>
            <tr className="bg-teal-600 text-white">
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Hackathon</th>
              <th className="px-4 py-2">Certificate Type</th>
              <th className="px-4 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {participants.map((participant) => (
              <tr key={participant._id} className="border-b">
                <td className="px-4 py-2">{participant.name}</td>
                <td className="px-4 py-2">{participant.email}</td>
                <td className="px-4 py-2">{participant.hackathonTitle}</td>
                <td className="px-4 py-2">
                  <select
                    value={certificateTypes[participant._id] || 'participation'}
                    onChange={(e) => handleCertificateTypeChange(participant._id, e.target.value)}
                    className="border rounded px-2 py-1"
                  >
                    <option value="participation">Participation</option>
                    <option value="winner1">Winner 1st</option>
                    <option value="winner2">Winner 2nd</option>
                    <option value="winner3">Winner 3rd</option>
                  </select>
                </td>
                <td className="px-4 py-2">
                  <button
                    onClick={() => handleGenerateCertificate(participant)}
                    disabled={processingParticipantId === participant._id}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-1 px-3 rounded"
                  >
                    {processingParticipantId === participant._id ? 'Processing...' : 'Generate Certificate'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Participants;
