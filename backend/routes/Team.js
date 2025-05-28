const express = require('express');
const router = express.Router();
const Team = require('../models/Team');
const Hackathon = require('../models/Hackathon');
const User = require('../models/User');
const { auth } = require('../middleware/auth');

// Create a team
router.post('/hackathons/:hackathonId/teams', auth, async (req, res) => {
  try {
    const { name } = req.body;
    const hackathonId = req.params.hackathonId;
    
    // Check if hackathon exists
    const hackathon = await Hackathon.findById(hackathonId);
    if (!hackathon) {
      return res.status(404).json({ message: 'Hackathon not found' });
    }
    
    // Check if user is already in a team for this hackathon
    const existingTeam = await Team.findOne({
      hackathonId,
      $or: [
        { leader: req.user.id },
        { members: req.user.id }
      ]
    });
    
    if (existingTeam) {
      return res.status(400).json({ message: 'You are already in a team for this hackathon' });
    }
    
    // Create new team
    const team = new Team({
      name,
      hackathonId,
      leader: req.user.id,
      members: [req.user.id]
    });
    
    await team.save();
    
    res.status(201).json(team);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user's team for a hackathon
router.get('/hackathons/:hackathonId/team', auth, async (req, res) => {
  try {
    const hackathonId = req.params.hackathonId;
    
    const team = await Team.findOne({
      hackathonId,
      $or: [
        { leader: req.user.id },
        { members: req.user.id }
      ]
    }).populate('leader', 'name email').populate('members', 'name email');
    
    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }
    
    res.json(team);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Invite a member to team
router.post('/teams/:teamId/invite', auth, async (req, res) => {
  try {
    const { email } = req.body;
    const teamId = req.params.teamId;
    
    // Check if team exists and user is leader
    const team = await Team.findById(teamId);
    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }
    
    if (team.leader.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Only team leader can invite members' });
    }
    
    // Check if hackathon exists
    const hackathon = await Hackathon.findById(team.hackathonId);
    if (!hackathon) {
      return res.status(404).json({ message: 'Hackathon not found' });
    }
    
    // Check team size limit
    if (team.members.length >= hackathon.maxTeamSize) {
      return res.status(400).json({ message: `Team size limit (${hackathon.maxTeamSize}) reached` });
    }
    
    // Check if email is already invited
    const existingInvite = team.invites.find(invite => invite.email === email);
    if (existingInvite) {
      return res.status(400).json({ message: 'User already invited' });
    }
    
    // Add invite
    team.invites.push({ email, status: 'pending' });
    await team.save();
    
    // TODO: Send email notification to invited user
    
    res.json({ message: 'Invitation sent successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Accept team invitation
router.post('/teams/invites/accept', auth, async (req, res) => {
  try {
    const { teamId } = req.body;
    
    // Find team with pending invitation for user's email
    const team = await Team.findOne({
      _id: teamId,
      'invites.email': req.user.email,
      'invites.status': 'pending'
    });
    
    if (!team) {
      return res.status(404).json({ message: 'No pending invitation found' });
    }
    
    // Check if user is already in another team for this hackathon
    const existingTeam = await Team.findOne({
      hackathonId: team.hackathonId,
      $or: [
        { leader: req.user.id },
        { members: req.user.id }
      ],
      _id: { $ne: team._id }
    });
    
    if (existingTeam) {
      return res.status(400).json({ message: 'You are already in a team for this hackathon' });
    }
    
    // Update invitation status
    const inviteIndex = team.invites.findIndex(invite => invite.email === req.user.email);
    team.invites[inviteIndex].status = 'accepted';
    
    // Add user to team members
    team.members.push(req.user.id);

    // Add user to hackathon participants if not already added
    const Hackathon = require('../models/Hackathon');
    const hackathon = await Hackathon.findById(team.hackathonId);
    if (hackathon) {
      if (!hackathon.participants.some(participantId => participantId.toString() === req.user.id)) {
        hackathon.participants.push(req.user.id);
        await hackathon.save();
      }
    }
    
    await team.save();
    
    res.json({ message: 'Invitation accepted successfully', team });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Remove member from team
router.delete('/teams/:teamId/members/:memberId', auth, async (req, res) => {
  try {
    const { teamId, memberId } = req.params;
    
    // Check if team exists
    const team = await Team.findById(teamId);
    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }
    
    // Check if user is team leader or removing themselves
    if (team.leader.toString() !== req.user.id && req.user.id !== memberId) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    // Cannot remove leader
    if (memberId === team.leader.toString()) {
      return res.status(400).json({ message: 'Team leader cannot be removed' });
    }
    
    // Remove member
    team.members = team.members.filter(member => member.toString() !== memberId);
    await team.save();
    
    res.json({ message: 'Member removed successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

const mongoose = require('mongoose');

// Get all pending invitations for logged-in user
router.get('/teams/invites', auth, async (req, res) => {
  try {
    // Use aggregation to do case-insensitive match on invites.email
    if (!req.user.email) {
      return res.status(400).json({ message: 'User email not found in token' });
    }
    const teamsWithInvites = await Team.aggregate([
      { $match: { 'invites.status': 'pending' } },
      { $unwind: '$invites' },
      { $match: { 'invites.status': 'pending', 'invites.email': { $regex: new RegExp(`^${req.user.email.trim()}$`, 'i') } } },
      {
        $lookup: {
          from: 'hackathons',
          localField: 'hackathonId',
          foreignField: '_id',
          as: 'hackathon'
        }
      },
      { $unwind: '$hackathon' },
      {
        $project: {
          teamId: '$_id',
          teamName: '$name',
          hackathonId: '$hackathon._id',
          hackathonTitle: '$hackathon.title',
          hackathonDates: {
            start: '$hackathon.startDate',
            end: '$hackathon.endDate'
          }
        }
      }
    ]);

    res.json(teamsWithInvites);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
