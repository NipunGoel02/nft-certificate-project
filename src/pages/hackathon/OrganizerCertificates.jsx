import React, { useState, useEffect } from 'react';
import axios from 'axios';

const OrganizerCertificates = () => {
  const [eligibleUsers, setEligibleUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [generating, setGenerating] = useState(null); // userId for which generation is in progress
  const [successMessage, setSuccessMessage] = useState(null);
  const [selectedCertificateTypes, setSelectedCertificateTypes] = useState({}); // key: userId_hackathonId, value: certificateType

  useEffect(() => {
    const fetchEligibleUsers = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const config = {
          headers: { Authorization: `Bearer ${token}` }
        };
        const response = await axios.get('/api/hackathons/organizer/certificates/eligible', config);
        setEligibleUsers(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch eligible users');
        setLoading(false);
      }
    };
    fetchEligibleUsers();
  }, []);

  const handleCertificateTypeChange = (userId, hackathonId, certificateType) => {
    setSelectedCertificateTypes(prev => ({
      ...prev,
      [`${userId}_${hackathonId}`]: certificateType
    }));
  };

  const handleGenerateCertificate = async (userId, hackathonId) => {
    try {
      setGenerating(userId);
      setSuccessMessage(null);
      const token = localStorage.getItem('token');
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };
      // Find hackathon by id for this user
      const user = eligibleUsers.find(u => u._id === userId);
      if (!user) {
        setError('User not found');
        setGenerating(null);
        return;
      }
      const hackathonObj = user.hackathons.find(h => h.id === hackathonId);
      if (!hackathonObj) {
        setError('Hackathon not found for user');
        setGenerating(null);
        return;
      }
      const key = `${userId}_${hackathonId}`;
      const certificateType = selectedCertificateTypes[key] || 'participation'; // default to participation if not selected
      const body = {
        participantId: userId,
        hackathonId: hackathonId,
        certificateType: certificateType
      };
      await axios.post('/api/hackathons/organizer/certificates/generate', body, config);
      setSuccessMessage(`Certificate generation request sent to ${user.name} for ${hackathonObj.title} as ${certificateType}`);
      setGenerating(null);
    } catch (err) {
      setError('Failed to generate certificate');
      setGenerating(null);
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

  if (eligibleUsers.length === 0) {
    return (
      <div className="text-center mt-8 text-gray-600">
        No users eligible for certificates.
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Generate Certificates</h1>
      {successMessage && (
        <div className="bg-green-100 text-green-700 p-4 rounded mb-6">
          {successMessage}
        </div>
      )}
      <div className="bg-white rounded-xl shadow-md p-6 overflow-x-auto">
        <table className="min-w-full table-auto">
          <thead>
            <tr className="bg-teal-600 text-white">
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Hackathons</th>
              <th className="px-4 py-2">Certificate Type</th>
              <th className="px-4 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {eligibleUsers.map(user => (
              <tr key={user._id} className="border-b">
                <td className="px-4 py-2">{user.name}</td>
                <td className="px-4 py-2">{user.email}</td>
                <td className="px-4 py-2">
                  {user.hackathons.map(h => h.title).join(', ')}
                </td>
                <td className="px-4 py-2">
                  {user.hackathons.map(h => {
                    const key = `${user._id}_${h.id}`;
                    return (
                      <select
                        key={h.id}
                        value={selectedCertificateTypes[key] || 'participation'}
                        onChange={(e) => handleCertificateTypeChange(user._id, h.id, e.target.value)}
                        className="border border-gray-300 rounded px-2 py-1 mr-2"
                      >
                        <option value="participation">Participation</option>
                        <option value="winner1">Winner 1</option>
                        <option value="winner2">Winner 2</option>
                        <option value="winner3">Winner 3</option>
                      </select>
                    );
                  })}
                </td>
                <td className="px-4 py-2">
                  {user.hackathons.map(h => (
                    <button
                      key={h.id}
                      onClick={() => handleGenerateCertificate(user._id, h.id)}
                      disabled={generating === user._id}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-1 px-3 rounded mr-2"
                    >
                      {generating === user._id ? 'Generating...' : `Generate for ${h.title}`}
                    </button>
                  ))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrganizerCertificates;
