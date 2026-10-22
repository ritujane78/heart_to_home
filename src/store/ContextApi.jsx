import React, { createContext, useContext, useState } from "react";
import { useEffect } from "react";
import api, { refreshAccessToken } from "../services/api";
import toast from "react-hot-toast";
import { jwtDecode } from "jwt-decode";

const ContextApi = createContext();

export const ContextProvider = ({ children }) => {
  //find the token in the localstorage
  const getToken = localStorage.getItem("JWT_TOKEN");
  //find is the user status from the localstorage
const isAdminStored = JSON.parse(localStorage.getItem("IS_ADMIN") || "false");

  //store the token
  const [token, setToken] = useState(getToken);

  //store the current loggedin user
  const [currentUser, setCurrentUser] = useState(null);
  //handle sidebar opening and closing in the admin panel
  const [openSidebar, setOpenSidebar] = useState(true);
  //check the loggedin user is admin or not
  const [isAdmin, setIsAdmin] = useState(isAdminStored);

  const fetchUser = async () => {
    const user = JSON.parse(localStorage.getItem("USER"));

    if (user?.username) {
      try {
        const { data } = await api.get(`/auth/user`);
        const roles = data.roles;

        if (roles.includes("ROLE_ADMIN")) {
          localStorage.setItem("IS_ADMIN", JSON.stringify(true));
          setIsAdmin(true);
        } else {
          localStorage.removeItem("IS_ADMIN");
          setIsAdmin(false);
        }
        setCurrentUser(data);
      } catch (error) {
        console.error("Error fetching current user", error);
        toast.error("Error fetching current user");
      }
    }
  };

  //if  token exist fetch the current user
  useEffect(() => {
    if (token) {
      fetchUser();
    }
  }, [token]);

  useEffect(() => {
    if (!token) return undefined;

    let cancelled = false;
    let refreshTimeout;

    const clearSession = () => {
      localStorage.removeItem("JWT_TOKEN");
      localStorage.removeItem("REFRESH_TOKEN");
      localStorage.removeItem("USER");
      localStorage.removeItem("IS_ADMIN");
      setToken(null);
      setCurrentUser(null);
      setIsAdmin(false);
    };

    const scheduleRefresh = (delay) => {
      refreshTimeout = window.setTimeout(async () => {
        try {
          const accessToken = await refreshAccessToken();
          if (!cancelled) setToken(accessToken);
        } catch (error) {
          if (error.response?.status === 401) {
            if (!cancelled) clearSession();
            return;
          }

          // Keep the session alive through temporary network or server errors.
          if (!cancelled) scheduleRefresh(15_000);
        }
      }, delay);
    };

    let refreshDelay = 14 * 60 * 1000;
    try {
      const { exp } = jwtDecode(token);
      if (exp) refreshDelay = Math.max(0, exp * 1000 - Date.now() - 60_000);
    } catch {
      // A malformed/expired access token should trigger a refresh immediately.
      refreshDelay = 0;
    }

    scheduleRefresh(refreshDelay);

    return () => {
      cancelled = true;
      window.clearTimeout(refreshTimeout);
    };
  }, [token]);

  //through context provider you are sending all the datas so that we access at anywhere in your application
  return (
    <ContextApi.Provider
      value={{
        token,
        setToken,
        currentUser,
        setCurrentUser,
        openSidebar,
        setOpenSidebar,
        isAdmin,
        setIsAdmin,
      }}
    >
      {children}
    </ContextApi.Provider>
  );
};

//by using this (useMyContext) custom hook we can reach our context provier and access the datas across our components
export const useMyContext = () => {
  const context = useContext(ContextApi);

  return context;
};
