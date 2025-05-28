const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Internship = require('../models/Internship');
const User = require('../models/User');
const { auth: authMiddleware, isInternshipOrganizer } = require('../middleware/auth');

// POST /api/internships - internship organizer fills internship form including user email
router.post('/', authMiddleware, isInternshipOrganizer, async (req, res) => {
  try {
    const { title, description, startDate, endDate, participantEmail, certificateType } = req.body;
    if (!title || !description || !startDate || !endDate || !participantEmail || !certificateType) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Find participant user by email
    const participant = await User.findOne({ email: participantEmail });
    if (!participant) {
      return res.status(404).json({ message: 'Participant user not found by email' });
    }

    // Create internship document
    const internship = new Internship({
      title,
      description,
      startDate,
      endDate,
      organizer: req.user.id,
      participants: [participant._id],
      certificateRequests: [{
        participant: participant._id,
        status: 'pending',
        requestedAt: new Date(),
        certificateType
      }]
    });

    await internship.save();

    // TODO: Send notification to participant email to mint certificate
    // This can be implemented with email service or notification system

    res.status(201).json(internship);
  } catch (error) {
    console.error('Error submitting internship form:', error);
    res.status(500).json({ message: 'Failed to submit internship form' });
  }
});

// GET /api/internships/certificates/requests - get pending certificate requests for logged-in user
router.get('/certificates/requests', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const internships = await Internship.find({
      certificateRequests: {
        $elemMatch: { participant: userId, status: 'pending' }
      }
    });
    const requests = [];
    internships.forEach(internship => {
      internship.certificateRequests.forEach(request => {
        if (request.participant.toString() === userId && request.status === 'pending') {
          requests.push({
            internshipId: internship._id,
            internshipTitle: internship.title,
            requestId: request._id,
            requestedAt: request.requestedAt
          });
        }
      });
    });
    res.json(requests);
  } catch (error) {
    console.error('Error fetching certificate requests:', error);
    res.status(500).json({ message: 'Failed to fetch certificate requests' });
  }
});

// POST /api/internships/certificates/requests/:requestId/accept - user accepts and mints certificate
router.post('/certificates/requests/:requestId/accept', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const requestId = req.params.requestId;
    const internship = await Internship.findOne({
      certificateRequests: {
        $elemMatch: { _id: requestId, participant: userId, status: 'pending' }
      }
    });
    if (!internship) {
      return res.status(404).json({ message: 'Certificate request not found or already processed' });
    }
    // TODO: Implement minting logic here (blockchain interaction)
    const request = internship.certificateRequests.id(requestId);
    request.status = 'minted';
    request.mintedAt = new Date();
    await internship.save();
    res.json({ message: 'Certificate minted successfully' });
  } catch (error) {
    console.error('Error accepting certificate request:', error);
    res.status(500).json({ message: 'Failed to accept certificate request' });
  }
});

router.get('/organizer', authMiddleware, isInternshipOrganizer, async (req, res) => {
  try {
    const organizerId = req.user.id;
    console.log('Fetching internships for organizer:', organizerId);
    const internships = await Internship.find({ organizer: organizerId }).sort({ createdAt: -1 });
    console.log('Internships found:', internships);
    res.json(internships);
  } catch (error) {
    console.error('Error fetching organizer internships:', error);
    res.status(500).json({ message: 'Failed to fetch internships' });
  }
});

// GET /api/internships/:id - get internship details by id
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const internshipId = req.params.id;
    console.log('Fetching internship with ID:', internshipId);
    if (!mongoose.Types.ObjectId.isValid(internshipId)) {
      console.log('Invalid internship ID:', internshipId);
      return res.status(400).json({ message: 'Invalid internship ID' });
    }
    const internship = await Internship.findById(internshipId).populate('organizer', 'name email');
    if (!internship) {
      console.log('Internship not found for ID:', internshipId);
      return res.status(404).json({ message: 'Internship not found' });
    }
    res.json(internship);
  } catch (error) {
    console.error('Error fetching internship details:', error);
    res.status(500).json({ message: 'Failed to fetch internship details' });
  }
});

module.exports = router;
