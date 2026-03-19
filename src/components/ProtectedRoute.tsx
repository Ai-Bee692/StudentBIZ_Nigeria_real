import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import React from "react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: ("student_entrepreneur" | "investor" | "admin")[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { session, profile, loading } = useAuth();
  const location = useLocation();

  if (loading && !session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!session && !loading) {
    // Redirect to login but save the current location to redirect back after login
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  if (allowedRoles && profile && !allowedRoles.includes(profile.role)) {
    // Role not allowed, redirect to home or unauthorized page
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
