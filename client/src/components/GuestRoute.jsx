import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Spinner from './Spinner';

function GuestRoute() {
  const { isAuthenticated, loading } = useAuth();

  // Show a loader while authentication state is being checked
  if (loading) {
    return <Spinner />;
  }

  // Redirect authenticated users away from guest-only pages
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // Allow guests to access the route
  return <Outlet />;
}

export default GuestRoute;
