 const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Hackathon = require('../models/Hackathon');
const { auth: authMiddleware } = require('../middleware/auth');

// GET /api/hackathons - list all hackathons
router.get('/', async (req, res) => {
  try {
    const hackathons = await Hackathon.find().sort({ startDate: -1 });
    res.json(hackathons);
  } catch (error) {
    console.error('Error fetching hackathons:', error);
    res.status(500).json({ message: 'Failed to fetch hackathons' });
  }
});
router.get('/my', authMiddleware, async (req, res) => {
  try {
    // Find hackathons where the user is the organizer
    const hackathons = await Hackathon.find({ organizer: req.user.id });
    res.json(hackathons);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/', authMiddleware, async (req, res) => {
  try {
    const hackathonData = req.body;
    // Remove organizer from client request body if present to avoid overwrite
    if ('organizer' in hackathonData) {
      delete hackathonData.organizer;
    }
    // Debug: log req.user to verify authentication middleware
    console.log('Authenticated user:', req.user);
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: 'Unauthorized: User not authenticated' });
    }
    hackathonData.organizer = req.user.id; // Set organizer to current user
    const hackathon = new Hackathon(hackathonData);
    await hackathon.save();
    res.status(201).json(hackathon);
  } catch (error) {
    console.error('Error creating hackathon:', error);
    res.status(400).json({ message: 'Failed to create hackathon', error: error.message });
  }
});
router.get('/registered', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Find hackathons where the user is in the participants array
    const hackathons = await Hackathon.find({ 
      participants: userId 
    }).sort({ startDate: -1 });
    
    res.json(hackathons);
  } catch (err) {
    console.error('Error fetching registered hackathons:', err);
    res.status(500).json({ message: 'Server error' });
  }
});
// GET /api/hackathons/:id - get hackathon details
router.get('/:id', async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid hackathon ID' });
    }
    const hackathon = await Hackathon.findById(req.params.id)
      .populate('participants', 'username email')
      .populate('submissions.user', 'username email');
    if (!hackathon) {
      return res.status(404).json({ message: 'Hackathon not found' });
    }
    res.json(hackathon);
  } catch (error) {
    console.error('Error in GET /api/hackathons/:id:', error);
    res.status(500).json({ message: 'Failed to fetch hackathon details' });
  }
});

// POST /api/hackathons/:id/register - register user for hackathon (protected)
router.post('/:id/register', authMiddleware, async (req, res) => {
  try {
    const hackathonId = req.params.id;
    const userId = req.user.id;

    console.log("Registering user:", userId, "for hackathon:", hackathonId);

    const hackathon = await Hackathon.findById(hackathonId);
    if (!hackathon) {
      return res.status(404).json({ message: 'Hackathon not found' });
    }

    // Filter out any undefined participants
    hackathon.participants = hackathon.participants.filter(p => p);

    const alreadyRegistered = hackathon.participants.some(
      (participant) => participant && participant.toString() === userId.toString()
    );

    if (alreadyRegistered) {
      return res.status(400).json({ message: 'User already registered' });
    }

    hackathon.participants.push(userId);
    await hackathon.save();

    res.json({ message: 'Registered successfully' });
  } catch (error) {
    console.error('Error in POST /api/hackathons/:id/register:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

// GET /api/hackathons/:id/submissions/my - get current user's submission for hackathon (protected)
router.get('/:id/submissions/my', authMiddleware, async (req, res) => {
  try {
    const hackathon = await Hackathon.findById(req.params.id);
    if (!hackathon) {
      return res.status(404).json({ message: 'Hackathon not found' });
    }
    const userId = req.user.id.toString();
    const submission = hackathon.submissions.find(sub => sub && sub.user && sub.user.toString() === userId);
    res.json(submission || null);
  } catch (error) {
    console.error('Error fetching user submission:', error);
    res.status(500).json({ message: 'Failed to fetch submission' });
  }
});

// POST /api/hackathons/:id/submissions - submit a project for hackathon (protected)
router.post('/:id/submissions', authMiddleware, async (req, res) => {
  try {
    const hackathon = await Hackathon.findById(req.params.id);
    if (!hackathon) {
      return res.status(404).json({ message: 'Hackathon not found' });
    }

    const userId = req.user.id.toString();
    const existingIndex = hackathon.submissions.findIndex(sub => sub.user.toString() === userId);

    const submissionData = {
      user: userId,
      title: req.body.title,
      description: req.body.description,
      projectUrl: req.body.projectUrl,
      demoUrl: req.body.demoUrl,
      techStack: req.body.techStack,
      challenges: req.body.challenges,
      screenshots: req.body.screenshots || [],
      submittedAt: new Date()
    };

    if (existingIndex !== -1) {
      // Update existing submission
      hackathon.submissions[existingIndex] = {
        ...hackathon.submissions[existingIndex]._doc,
        ...submissionData
      };
    } else {
      // Add new submission
      hackathon.submissions.push(submissionData);
    }

    await hackathon.save();
    res.status(201).json({ message: 'Submission saved successfully' });
  } catch (error) {
    console.error('Error submitting project:', error);
    res.status(400).json({ message: 'Failed to submit project', error: error.message });
  }
});


router.get('/organizer/participants', authMiddleware, async (req, res) => {
  try {
    const organizerId = req.user.id;
    // Find hackathons organized by the current user
    const hackathons = await Hackathon.find({ organizer: organizerId }).populate('participants', 'username email');
    // Aggregate participants with hackathon title and ID
    const participants = [];
    hackathons.forEach(hackathon => {
      hackathon.participants.forEach(participant => {
        participants.push({
          _id: participant._id,
          name: participant.name,
          email: participant.email,
          hackathonTitle: hackathon.title,
          hackathonId: hackathon._id // <-- This is crucial!
        });
      });
    });
    res.json(participants);
  } catch (error) {
    console.error('Error fetching participants for organizer:', error);
    res.status(500).json({ message: 'Failed to fetch participants' });
  }
});

router.get('/organizer/submissions', authMiddleware, async (req, res) => {
  try {
    const organizerId = req.user.id;
    // Find hackathons organized by the current user
    const hackathons = await Hackathon.find({ organizer: organizerId });
    // Aggregate submissions with hackathon title
    const submissions = [];
    hackathons.forEach(hackathon => {
      hackathon.submissions.forEach(submission => {
        submissions.push({
          _id: submission._id,
          user: submission.user,
          title: submission.title,
          description: submission.description,
          projectUrl: submission.projectUrl,
          demoUrl: submission.demoUrl,
          techStack: submission.techStack,
          challenges: submission.challenges,
          screenshots: submission.screenshots,
          submittedAt: submission.submittedAt,
          hackathonTitle: hackathon.title
        });
      });
    });
    res.json(submissions);
  } catch (error) {
    console.error('Error fetching submissions for organizer:', error);
    res.status(500).json({ message: 'Failed to fetch submissions' });
  }
});


router.get('/organizer/certificates/eligible', authMiddleware, async (req, res) => {
  try {
    const organizerId = req.user.id;
    // Find hackathons organized by the current user
    const hackathons = await Hackathon.find({ organizer: organizerId }).populate('participants', 'name email');
    // Aggregate unique participants eligible for certificates
    const participantsMap = new Map();
    hackathons.forEach(hackathon => {
      hackathon.participants.forEach(participant => {
        if (!participantsMap.has(participant._id.toString())) {
          participantsMap.set(participant._id.toString(), {
            _id: participant._id,
            name: participant.name,
            email: participant.email,
            hackathons: [{ id: hackathon._id, title: hackathon.title }]
          });
        } else {
          participantsMap.get(participant._id.toString()).hackathons.push({ id: hackathon._id, title: hackathon.title });
        }
      });
    });
    const eligibleParticipants = Array.from(participantsMap.values());
    res.json(eligibleParticipants);
  } catch (error) {
    console.error('Error fetching eligible participants for certificates:', error);
    res.status(500).json({ message: 'Failed to fetch eligible participants' });
  }
});

router.post('/organizer/certificates/generate', authMiddleware, async (req, res) => {
  try {
    console.log('Certificate generation request body:', req.body); // Added logging
    const organizerId = req.user.id;
    const { participantId, hackathonId, certificateType } = req.body;
    if (!participantId || !hackathonId || !certificateType) {
      return res.status(400).json({ message: 'participantId, hackathonId and certificateType are required' });
    }
    // Verify hackathon belongs to organizer
    const hackathon = await Hackathon.findOne({ _id: hackathonId, organizer: organizerId });
    if (!hackathon) {
      return res.status(404).json({ message: 'Hackathon not found or not authorized' });
    }
    // Verify participant is registered in hackathon
    if (!hackathon.participants.includes(participantId)) {
      return res.status(400).json({ message: 'Participant not registered in this hackathon' });
    }
    // Check if certificate request already exists for this type
    const existingRequest = hackathon.certificateRequests.find(
      (req) => req.participant.toString() === participantId.toString() && req.status === 'pending' && req.certificateType === certificateType
    );
    if (existingRequest) {
      return res.status(400).json({ message: 'Certificate request already pending for this participant and certificate type' });
    }
    // Add new certificate request
    hackathon.certificateRequests.push({
      participant: participantId,
      status: 'pending',
      requestedAt: new Date(),
      certificateType: certificateType
    });
    await hackathon.save();
    res.json({ message: 'Certificate generation request sent successfully' });
  } catch (error) {
    console.error('Error generating certificate:', error);
    res.status(500).json({ message: 'Failed to generate certificate' });
  }
});

// GET /api/hackathons/certificates/requests - get pending certificate requests for logged-in user
router.get('/certificates/requests', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    // Find hackathons where user has pending certificate requests
    const hackathons = await Hackathon.find({
      certificateRequests: {
        $elemMatch: { participant: userId, status: 'pending' }
      }
    });
    // Aggregate requests with hackathon info
    const requests = [];
    hackathons.forEach(hackathon => {
      hackathon.certificateRequests.forEach(request => {
        if (request.participant.toString() === userId && request.status === 'pending') {
          requests.push({
            hackathonId: hackathon._id,
            hackathonTitle: hackathon.title,
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

// POST /api/hackathons/certificates/requests/:requestId/accept - user accepts and mints certificate
router.post('/certificates/requests/:requestId/accept', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const requestId = req.params.requestId;
    // Find hackathon containing the certificate request
    const hackathon = await Hackathon.findOne({
      certificateRequests: {
        $elemMatch: { _id: requestId, participant: userId, status: 'pending' }
      }
    });
    if (!hackathon) {
      return res.status(404).json({ message: 'Certificate request not found or already processed' });
    }
    // TODO: Implement minting logic here (blockchain interaction)
    // Update request status to accepted and minted
    const request = hackathon.certificateRequests.id(requestId);
    request.status = 'minted';
    request.mintedAt = new Date();
    await hackathon.save();
    res.json({ message: 'Certificate minted successfully' });
  } catch (error) {
    console.error('Error accepting certificate request:', error);
    res.status(500).json({ message: 'Failed to accept certificate request' });
  }
});

module.exports = router;
