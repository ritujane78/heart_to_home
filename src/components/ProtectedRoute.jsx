import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useMyContext } from "../store/ContextApi";

const ProtectedRoute = ({
  children,
  adminPage,
  restrictedUsernames = [],
}) => {
  const { token, isAdmin, currentUser } = useMyContext();
  const location = useLocation();

  // Redirect unauthenticated users
  if (!token) {
    sessionStorage.setItem(
      "GM_POST_LOGIN_PATH",
      `${location.pathname}${location.search}${location.hash}`,
    );
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
