const mongoose = require('mongoose');
const Hackathon = require('../models/Hackathon');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/your-db-name';

async function updateHackathonStatuses() {
  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const now = new Date();

    // Find hackathons that need status update
    const hackathons = await Hackathon.find();

    for (const hackathon of hackathons) {
      let newStatus = hackathon.status;

      if (now < hackathon.startDate) {
        newStatus = 'upcoming';
      } else if (now >= hackathon.startDate && now <= hackathon.endDate) {
        newStatus = 'active';
      } else if (now > hackathon.endDate) {
        newStatus = 'completed';
      }

      if (hackathon.status !== newStatus) {
        hackathon.status = newStatus;
        await hackathon.save();
        console.log(`Updated hackathon ${hackathon._id} status to ${newStatus}`);
      }
    }

    console.log('Hackathon status update completed.');
    process.exit(0);
  } catch (error) {
    console.error('Error updating hackathon statuses:', error);
    process.exit(1);
  }
}

updateHackathonStatuses();
