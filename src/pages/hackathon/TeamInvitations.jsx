import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';

const TeamInvitations = () => {
  const [invitations, setInvitations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState({});

  useEffect(() => {
    const fetchInvitations = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        if (!token) {
          setError('User not authenticated');
          setLoading(false);
          return;
        }
        const config = {
          headers: { Authorization: `Bearer ${token}` }
        };
        const response = await axios.get('/api/teams/invites', config);
        // Ensure response.data is an array before setting state
        if (Array.isArray(response.data)) {
          setInvitations(response.data);
        } else if (response.data) {
          setInvitations([response.data]);
        } else {
          setInvitations([]);
        }
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch team invitations');
        setLoading(false);
      }
    };
    fetchInvitations();
  }, []);

  const handleAccept = async (teamId) => {
    try {
      setActionLoading(prev => ({ ...prev, [teamId]: 'accepting' }));
      const token = localStorage.getItem('token');
      await axios.post('/api/teams/invites/accept', 
        { teamId },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      // Remove this invitation from the list
      setInvitations(invitations.filter(invite => invite.teamId !== teamId));
      setActionLoading(prev => ({ ...prev, [teamId]: null }));
    } catch (err) {
      setError('Failed to accept invitation');
      setActionLoading(prev => ({ ...prev, [teamId]: null }));
    }
  };

  const handleDecline = async (teamId) => {
    try {
      setActionLoading(prev => ({ ...prev, [teamId]: 'declining' }));
      const token = localStorage.getItem('token');
      await axios.post('/api/teams/invites/decline', 
        { teamId },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      // Remove this invitation from the list
      setInvitations(invitations.filter(invite => invite.teamId !== teamId));
      setActionLoading(prev => ({ ...prev, [teamId]: null }));
    } catch (err) {
      setError('Failed to decline invitation');
      setActionLoading(prev => ({ ...prev, [teamId]: null }));
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded-lg">{error}</div>
    );
  }

  if (invitations.length === 0) {
    return (
      <div className="bg-gray-50 rounded-lg p-6 text-center">
        <p className="text-gray-600">No pending team invitations</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {invitations.map((invite) => (
        <motion.div 
          key={invite.teamId}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm"
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div className="mb-4 md:mb-0">
              <h4 className="font-medium text-gray-800">{invite.teamName}</h4>
              <p className="text-sm text-gray-600">
                Hackathon: {invite.hackathonTitle}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {invite.hackathonDates && typeof invite.hackathonDates === 'object' && invite.hackathonDates.start ? new Date(invite.hackathonDates.start).toLocaleDateString() : 'N/A'} - {invite.hackathonDates && typeof invite.hackathonDates === 'object' && invite.hackathonDates.end ? new Date(invite.hackathonDates.end).toLocaleDateString() : 'N/A'}
              </p>
            </div>
            
            <div className="flex space-x-2">
              <button
                onClick={() => handleAccept(invite.teamId)}
                disabled={actionLoading[invite.teamId]}
                className="px-4 py-2 bg-teal-600 text-white text-sm rounded-md hover:bg-teal-700 transition-colors disabled:opacity-50"
              >
                {actionLoading[invite.teamId] === 'accepting' ? 'Accepting...' : 'Accept'}
              </button>
              <button
                onClick={() => handleDecline(invite.teamId)}
                disabled={actionLoading[invite.teamId]}
                className="px-4 py-2 bg-gray-200 text-gray-800 text-sm rounded-md hover:bg-gray-300 transition-colors disabled:opacity-50"
              >
                {actionLoading[invite.teamId] === 'declining' ? 'Declining...' : 'Decline'}
              </button>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default TeamInvitations;
