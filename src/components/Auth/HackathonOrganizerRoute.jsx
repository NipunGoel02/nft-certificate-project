// src/components/Auth/HackathonOrganizerRoute.jsx
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../Context/AuthContext';

const HackathonOrganizerRoute = () => {
  const { currentUser, loading } = useAuth();

  console.log("HackathonOrganizerRoute currentUser:", currentUser, "loading:", loading); // Debug log

  if (loading) {
    // Optionally render a loading indicator or null while auth state is loading
    return null;
  }

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (currentUser.role !== 'hackathon organizer') {
    console.log("User role is not hackathon organizer, redirecting to home"); // Debug log
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default HackathonOrganizerRoute;
