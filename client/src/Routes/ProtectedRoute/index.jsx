import React from "react";
import { useAuth } from "../../Contexts/Auth";
import { Navigate } from "react-router-dom";
import { moveUserTo } from "../../Utils/moveUserTo";
import paths from "../../Constants/paths";

const ProtectedRoute = ({
	children,
	restrictAuthenticated = false,
	isPublic = true,
	requiredRole,
}) => {
	const { isAuthenticated, user } = useAuth();

	if (isAuthenticated) {
		if (restrictAuthenticated) {
			return <Navigate to={moveUserTo(user?.role)} replace />;
		}
		if (requiredRole && !requiredRole?.includes(user?.role?.name)) {
			return <Navigate to={paths.home} replace />;
		}
		return children;
	}

	if (!isPublic) {
		return <Navigate to={paths.login} replace />;
	}

	return children;
};

export default React.memo(ProtectedRoute);
