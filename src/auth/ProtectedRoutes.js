import { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "./AuthContext";

function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useContext(AuthContext);
  const location = useLocation();

  if (loading) return <p className="text-center mt-5">Loading...</p>;

  return isAuthenticated 
    ? children 
    : <Navigate to="/login" state={{ from: location }} replace />;
}

export default ProtectedRoute;
