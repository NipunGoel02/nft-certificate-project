// src/components/Auth/PrivateRoute.jsx
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../Context/AuthContext';

const PrivateRoute = () => {
  const { currentUser } = useAuth();
  const location = useLocation();
  
  console.log("Authentication check:", !!currentUser); // Debug log
  
  if (!currentUser) {
    // Save the attempted location for redirect after login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  return <Outlet />;
};

export default PrivateRoute;
