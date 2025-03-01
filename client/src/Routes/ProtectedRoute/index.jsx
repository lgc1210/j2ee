import React from "react";
import { useAuth } from "../../Contexts/Auth";
import { Navigate } from "react-router-dom";
import paths from "../../Constants/paths";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated()) return <Navigate to={paths.login} replace />;

  return <>{children}</>;
};

export default ProtectedRoute;
