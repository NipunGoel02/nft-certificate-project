// src/components/Auth/AdminRoute.jsx
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../Context/AuthContext';

const AdminRoute = () => {
  const { currentUser } = useAuth();
  
  console.log("Current user in AdminRoute:", currentUser); // Debug

  // Check if user is authenticated and has admin role
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }
  
  if (currentUser.role !== 'admin') {
    console.log("User is not admin, redirecting"); // Debug
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default AdminRoute;
