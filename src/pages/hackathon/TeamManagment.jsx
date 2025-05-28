import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';

const TeamManagement = () => {
  const { id } = useParams(); // hackathon ID
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [team, setTeam] = useState(null);
  const [hackathon, setHackathon] = useState(null);
  const [email, setEmail] = useState('');
  const [invitations, setInvitations] = useState([]);
  const [inviteLoading, setInviteLoading] = useState(false);
  const [invitationActionLoading, setInvitationActionLoading] = useState(false);
  const [invitationError, setInvitationError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch hackathon details
        const hackathonRes = await axios.get(`/api/hackathons/${id}`);
        setHackathon(hackathonRes.data);
        
        // Fetch team if exists
        try {
          const teamRes = await axios.get(`/api/hackathons/${id}/team`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
            }
          });
          setTeam(teamRes.data);
        } catch (err) {
          // No team found, that's okay
          console.log('No team found');
        }
        
        // Fetch pending invitations for logged-in user
        try {
          const invitesRes = await axios.get('/api/teams/invites', {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
            }
          });
          setInvitations(invitesRes.data);
        } catch (err) {
          console.error('Error fetching invitations:', err);
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err.response?.data?.message || 'Failed to load data');
        setLoading(false);
      }
    };
    
    fetchData();
  }, [id]);

  const acceptInvitation = async (teamId) => {
    try {
      setInvitationActionLoading(true);
      setInvitationError(null);
      await axios.post('/api/teams/invites/accept', { teamId }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      // Refresh invitations and team data
      const invitesRes = await axios.get('/api/teams/invites', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setInvitations(invitesRes.data);

      // Refresh team data
      const teamRes = await axios.get(`/api/hackathons/${id}/team`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setTeam(teamRes.data);
    } catch (err) {
      setInvitationError(err.response?.data?.message || 'Failed to accept invitation');
    } finally {
      setInvitationActionLoading(false);
    }
  };

  const rejectInvitation = async (teamId) => {
    // For now, rejecting invitation can be implemented as removing the invite from the team invites array
    // This requires a backend API to handle rejection, which is not implemented yet.
    alert('Reject invitation feature is not implemented yet.');
  };

  const createTeam = async (e) => {
    e.preventDefault();
    const teamName = e.target.teamName.value;
    
    try {
      const res = await axios.post(`/api/hackathons/${id}/teams`, 
        { name: teamName },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      
      setTeam(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create team');
    }
  };

  const inviteMember = async (e) => {
    e.preventDefault();
    
    if (!email) return;
    
    try {
      setInviteLoading(true);
      await axios.post(`/api/teams/${team._id}/invite`, 
        { email },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      
      // Refresh team data
      const teamRes = await axios.get(`/api/hackathons/${id}/team`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setTeam(teamRes.data);
      setEmail('');
      setInviteLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to invite member');
      setInviteLoading(false);
    }
  };

  const removeMember = async (memberId) => {
    try {
      await axios.delete(`/api/teams/${team._id}/members/${memberId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      // Refresh team data
      const teamRes = await axios.get(`/api/hackathons/${id}/team`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setTeam(teamRes.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to remove member');
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
      <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
        <p className="text-red-700">{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Link to={`/hackathons/${id}`} className="text-teal-600 hover:text-teal-800 flex items-center">
          <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
          </svg>
          Back to Hackathon
        </Link>
      </div>
      
      <h1 className="text-3xl font-bold mb-6">Team Management</h1>
      <h2 className="text-xl text-gray-600 mb-8">
        {hackathon?.title || 'Hackathon'}
      </h2>
      
      {team ? (
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold text-teal-700">{team.name}</h3>
            <span className="bg-teal-100 text-teal-800 text-sm px-3 py-1 rounded-full">
              {team.members.length} / {hackathon?.maxTeamSize || '?'} Members
            </span>
          </div>
          
          <div className="mb-8">
            <h4 className="font-semibold text-gray-700 mb-4">Team Members</h4>
            <div className="space-y-3">
              {team.members.map(member => (
                <div key={member._id} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 font-bold mr-3">
                      {member.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div>
                      <p className="font-medium">{member.name}</p>
                      <p className="text-sm text-gray-500">{member.email}</p>
                    </div>
                  </div>
                  
                  {member._id === team.leader._id ? (
                    <span className="bg-teal-100 text-teal-800 text-xs px-2 py-1 rounded-full">Team Leader</span>
                  ) : (
                    <button 
                      onClick={() => removeMember(member._id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                      </svg>
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
          
          {team.members.length < hackathon?.maxTeamSize && team.leader._id === team.members.find(m => m._id === team.leader._id)?._id && (
            <div>
              <h4 className="font-semibold text-gray-700 mb-4">Invite Team Members</h4>
              <form onSubmit={inviteMember} className="flex">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter email address"
                  className="flex-grow px-4 py-2 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  required
                />
                <button
                  type="submit"
                  className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-r-lg"
                  disabled={inviteLoading}
                >
                  {inviteLoading ? 'Sending...' : 'Invite'}
                </button>
              </form>
              
              {team.invites && team.invites.length > 0 && (
                <div className="mt-6">
                  <h5 className="font-medium text-gray-700 mb-2">Pending Invitations</h5>
                  <ul className="space-y-2">
                    {team.invites.filter(invite => invite.status === 'pending').map((invite, index) => (
                      <li key={index} className="flex items-center justify-between bg-yellow-50 p-2 rounded">
                        <span>{invite.email}</span>
                        <span className="text-xs text-yellow-600">Pending</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        <>
          {invitations.length > 0 && (
            <div className="bg-white rounded-xl shadow-md p-6 mb-6">
              <h3 className="text-2xl font-bold text-teal-700 mb-4">Pending Invitations</h3>
              {invitationError && (
                <div className="bg-red-100 text-red-700 p-2 rounded mb-4">{invitationError}</div>
              )}
              <ul className="space-y-4">
                {invitations.map(invite => (
                  <li key={invite.teamId} className="border border-gray-300 rounded p-4 flex justify-between items-center">
                    <div>
                      <p className="font-semibold">{invite.teamName}</p>
                      <p className="text-sm text-gray-600">{invite.hackathonTitle}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(invite.hackathonDates.start).toLocaleDateString()} - {new Date(invite.hackathonDates.end).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => acceptInvitation(invite.teamId)}
                        disabled={invitationActionLoading}
                        className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded"
                      >
                        {invitationActionLoading ? 'Processing...' : 'Accept'}
                      </button>
                      <button
                        onClick={() => rejectInvitation(invite.teamId)}
                        disabled={invitationActionLoading}
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
                      >
                        Reject
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="text-center py-8">
              <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
              </svg>
              <h3 className="text-xl font-semibold mb-2">You're not part of a team yet</h3>
              <p className="text-gray-600 mb-6">Create a team to collaborate with others in this hackathon</p>
              
              <form onSubmit={createTeam} className="max-w-md mx-auto">
                <div className="mb-4">
                  <label htmlFor="teamName" className="block text-gray-700 font-medium mb-2">
                    Team Name
                  </label>
                  <input
                    type="text"
                    id="teamName"
                    name="teamName"
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="Enter team name"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-teal-600 hover:bg-teal-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-300"
                >
                  Create Team
                </button>
              </form>
            </div>
          </div>
        
        </>
      )}
       </div> 
  );
};
    
export default TeamManagement;
