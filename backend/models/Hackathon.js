const mongoose = require('mongoose');

const PrizeSchema = new mongoose.Schema({
  rank: { type: String, required: true },
  prize: { type: String, required: true },
  amount: { type: Number, default: 0 }
});

const JudgingCriteriaSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  weightage: { type: Number, required: true, min: 1, max: 10 }
});

const SubmissionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  projectUrl: { type: String, required: true },
  demoUrl: { type: String },
  techStack: { type: String, required: true },
  challenges: { type: String },
  screenshots: [{ type: String }],
  submittedAt: { type: Date, default: Date.now }
});

const CertificateRequestSchema = new mongoose.Schema({
  participant: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['pending', 'accepted', 'minted', 'rejected'], default: 'pending' },
  requestedAt: { type: Date, default: Date.now },
  mintedAt: { type: Date },
  certificateType: { type: String, enum: ['participation', 'winner1', 'winner2', 'winner3'], default: 'participation' }
});

const HackathonSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  submissionDeadline: { type: Date, required: true },
  isTeamEvent: { type: Boolean, default: true },
  minTeamSize: { type: Number, default: 1 },
  maxTeamSize: { type: Number, default: 4 },
  rules: [{ type: String }],
  prizes: [PrizeSchema],
  judgingCriteria: [JudgingCriteriaSchema],
  banner: { type: String },
  status: { type: String, enum: ['upcoming', 'active', 'completed'], default: 'upcoming' },
  organizer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  submissions: [SubmissionSchema],
  certificateRequests: [CertificateRequestSchema],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Hackathon', HackathonSchema);
