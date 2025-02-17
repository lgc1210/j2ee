import React from "react";
import { useAuth } from "../../Contexts/Auth";
import Login from "../../Pages/Login";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated()) {
    return <Login />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
