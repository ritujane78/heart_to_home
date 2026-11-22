import React from "react";
import { Navigate } from "react-router-dom";
import { useMyContext } from "../store/ContextApi";

const ProtectedRoute = ({
  children,
  adminPage,
  restrictedUsernames = [],
}) => {
  const { token, isAdmin, currentUser } = useMyContext();

  // Redirect unauthenticated users
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Redirect non-admins from admin pages
  if (adminPage && !isAdmin) {
    return <Navigate to="/access-denied" replace />;
  }

  // Restrict specific usernames from selected pages
  const username = currentUser?.username?.toLowerCase();

  if (restrictedUsernames.map((u) => u.toLowerCase()).includes(username)) {
    return <Navigate to="/access-denied" replace />;
  }

  return children;
};

export default ProtectedRoute;