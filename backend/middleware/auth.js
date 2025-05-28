const jwt = require('jsonwebtoken');

const JWT_SECRET = 'supersecretkey12345'; // Replace with your actual secret key
const isAdmin = (req, res, next) => {
  // Check if user is admin (modify according to your auth system)
  if(req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Admin access required' });
  }
};

const isInternshipOrganizer = (req, res, next) => {
  // Check if user is internship organizer
  if(req.user && req.user.role === 'internship') {
    next();
  } else {
    res.status(403).json({ message: 'Internship organizer access required' });
  }
};

function auth(req, res, next) {
  const authHeader = req.header('Authorization');
  console.log('Authorization header:', authHeader);
  const token = authHeader?.replace('Bearer ', '');
  console.log('Extracted token:', token);
  if (!token) {
    console.log('No token found in request');
    return res.status(401).json({ message: 'No token, authorization denied' });
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log('Token verified successfully:', decoded);
    req.user = decoded.user;
    next();
  } catch (err) {
    console.log('Token verification failed:', err.message);
    res.status(401).json({ message: 'Token is not valid' });
  }
}

module.exports = { auth, isAdmin, isInternshipOrganizer };
