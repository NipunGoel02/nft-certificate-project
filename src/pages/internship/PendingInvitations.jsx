import React, { useEffect, useState } from 'react';
import axios from 'axios';

const PendingInvitations = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const response = await axios.get('/api/internships/certificates/requests', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setRequests(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch pending invitations');
        setLoading(false);
      }
    };
    fetchRequests();
  }, []);

  const handleAccept = async (requestId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`/api/internships/certificates/requests/${requestId}/accept`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Certificate minted successfully');
      setRequests(requests.filter(r => r.requestId !== requestId));
    } catch (err) {
      alert('Failed to mint certificate');
    }
  };

  if (loading) return <div>Loading pending invitations...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Pending Internship Invitations</h1>
      {requests.length === 0 ? (
        <p>No pending invitations.</p>
      ) : (
        <ul className="space-y-4">
          {requests.map((request) => (
            <li key={request.requestId} className="border p-4 rounded shadow flex justify-between items-center">
              <div>
                <p className="font-semibold">{request.internshipTitle}</p>
                <p className="text-sm text-gray-600">Requested at: {new Date(request.requestedAt).toLocaleString()}</p>
              </div>
              <button
                onClick={() => {
                  if (typeof window !== 'undefined') {
                    window.location.assign(`/internships/certificate/${request.internshipId}`);
                  }
                }}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                Mint Certificate
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default PendingInvitations;
