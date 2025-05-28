import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const PendingInvitations = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [processingRequestId, setProcessingRequestId] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        setLoading(true);
        setError(null);

        const token = localStorage.getItem('token');
        if (!token) {
          setError('No authorization token found. Please login.');
          setLoading(false);
          return;
        }

        const config = {
          headers: { Authorization: `Bearer ${token}` },
        };

        const response = await axios.get('/api/hackathons/certificates/requests', config);
        console.log('API response data:', response.data);

        if (Array.isArray(response.data)) {
          setRequests(response.data);
        } else if (response.data) {
          setRequests([response.data]);
        } else {
          setRequests([]);
        }
        setLoading(false);
      } catch (err) {
        console.error('Fetch error:', err);
        setError('Failed to fetch certificate requests');
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  const handleAccept = async (requestId, hackathonId) => {
    try {
      setProcessingRequestId(requestId);
      setSuccessMessage(null);
      setError(null);

      const token = localStorage.getItem('token');
      if (!token) {
        setError('No authorization token found. Please login.');
        setProcessingRequestId(null);
        return;
      }

      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };

      await axios.post(`/api/hackathons/certificates/requests/${requestId}/accept`, {}, config);

      setSuccessMessage('Certificate minted successfully');

      // Remove accepted request from list
      setRequests((prev) => prev.filter((r) => r.requestId !== requestId));

      setProcessingRequestId(null);
      navigate(`/hackathons/certificate/${hackathonId}`);
    } catch (err) {
      console.error('Accept error:', err);
      setError('Failed to mint certificate');
      setProcessingRequestId(null);
    }
  };

  // Debug log right before render
  console.log('Rendering requests:', requests);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-600 text-center mt-8">{error}</div>;
  }

  if (!Array.isArray(requests) || requests.length === 0) {
    return (
      <div className="text-center mt-8 text-gray-600">
        No pending certificate requests.
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Pending Certificate Requests</h1>

      {successMessage && (
        <div className="bg-green-100 text-green-700 p-4 rounded mb-6">
          {successMessage}
        </div>
      )}

      <div className="bg-white rounded-xl shadow-md p-6 overflow-x-auto">
        <table className="min-w-full table-auto">
          <thead>
            <tr className="bg-teal-600 text-white">
              <th className="px-4 py-2">Hackathon</th>
              <th className="px-4 py-2">Requested At</th>
              <th className="px-4 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(requests) ? (
              requests.map((request) => (
                <tr key={request.requestId} className="border-b">
                  <td className="px-4 py-2">{request.hackathonTitle}</td>
                  <td className="px-4 py-2">
                    {new Date(request.requestedAt).toLocaleString()}
                  </td>
                  <td className="px-4 py-2">
                    <button
                      onClick={() => handleAccept(request.requestId, request.hackathonId)}
                      disabled={processingRequestId === request.requestId}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-1 px-3 rounded"
                    >
                      {processingRequestId === request.requestId
                        ? 'Processing...'
                        : 'Mint Certificate'}
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="text-center text-gray-600 py-4">
                  No requests data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PendingInvitations;
