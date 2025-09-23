import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Spinner from './Spinner';

function ProtectedRoute() {
  const { isAuthenticated, loading } = useAuth();

  // Show a loader while authentication state is being checked
  if (loading) {
    return <Spinner />;
  }

  // Redirect to login if the user is not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;
