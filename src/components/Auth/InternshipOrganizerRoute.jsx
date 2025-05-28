// src/components/Auth/InternshipOrganizerRoute.jsx
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../Context/AuthContext';

const InternshipOrganizerRoute = () => {
  const { currentUser, loading } = useAuth();

  if (loading) {
    // Optionally render a loading indicator or null while auth state is loading
    return null;
  }

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (currentUser.role !== 'internship') {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default InternshipOrganizerRoute;
