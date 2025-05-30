import React, { useState, useEffect } from 'react';
import apiClient from '../../services/apiClient';

const OrganizerCertificates = () => {
  const [eligibleUsers, setEligibleUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [generating, setGenerating] = useState(''); // key: userId_hackathonId
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
        const response = await apiClient.get('/hackathons/organizer/certificates/eligible', config);
        setEligibleUsers(response.data);
        setLoading(false);
      } catch (err) { 
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
    const key = `${userId}_${hackathonId}`;
    try {
      setGenerating(key);
      setSuccessMessage(null);
      setError(null);
      if (!userId) {
        setError('participantId is undefined');
        setGenerating('');
        return;
      }
      if (!hackathonId) {
        setError('hackathonId is undefined');
        setGenerating('');
        return;
      }
      const token = localStorage.getItem('token');
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };
      // Find user and hackathon objects for display
      const user = eligibleUsers.find(u => u._id === userId);
      const hackathonObj = user?.hackathons.find(h => h.id === hackathonId);
      const certificateType = selectedCertificateTypes[key] || 'participation'; // default to participation if not selected
      const body = {
        participantId: userId,
        hackathonId: hackathonId,
        certificateType: certificateType
      };
      try {
        await apiClient.post('/hackathons/organizer/certificates/generate', body, config);
        setSuccessMessage(`Certificate generation request sent to ${user.name} for ${hackathonObj.title} as ${certificateType}`);
      } catch (error) {
        if (error.response && error.response.data && error.response.data.message) {
          console.log((error.response.data.message));
        } else {
          setError('Failed to send certificate request');
        }
      }
      setGenerating('');
    } catch (err) {
      setGenerating('');
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

  // Flatten to one row per user per hackathon
  const rows = [];
  eligibleUsers.forEach(user => {
    user.hackathons.forEach(h => {
      rows.push({
        userId: user._id,
        userName: user.name,
        userEmail: user.email,
        hackathonId: h.id,
        hackathonTitle: h.title,
      });
    });
  });

  if (rows.length === 0) {
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
              <th className="px-4 py-2">Hackathon</th>
              <th className="px-4 py-2">Certificate Type</th>
              <th className="px-4 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(row => {
              const key = `${row.userId}_${row.hackathonId}`;
              return (
                <tr key={key} className="border-b">
                  <td className="px-4 py-2">{row.userName}</td>
                  <td className="px-4 py-2">{row.userEmail}</td>
                  <td className="px-4 py-2">{row.hackathonTitle}</td>
                  <td className="px-4 py-2">
                    <select
                      value={selectedCertificateTypes[key] || 'participation'}
                      onChange={(e) => handleCertificateTypeChange(row.userId, row.hackathonId, e.target.value)}
                      className="border border-gray-300 rounded px-2 py-1"
                    >
                      <option value="participation">Participation</option>
                      <option value="winner1">Winner 1</option>
                      <option value="winner2">Winner 2</option>
                      <option value="winner3">Winner 3</option>
                    </select>
                  </td>
                  <td className="px-4 py-2">
                    <button
                      onClick={() => handleGenerateCertificate(row.userId, row.hackathonId)}
                      disabled={generating === key}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-1 px-3 rounded"
                    >
                      {generating === key ? 'Generating...' : 'Generate Certificate'}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrganizerCertificates;
