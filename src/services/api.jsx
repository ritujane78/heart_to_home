import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("JWT_TOKEN");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);
let isRefreshing = false;
let refreshPromise = null;

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        if (!isRefreshing) {
          isRefreshing = true;

          const refreshToken = localStorage.getItem("REFRESH_TOKEN");

          refreshPromise = axios
            .post(`${API_URL}/api/auth/public/refresh-token`, {
              refreshToken,
            })
            .then((response) => {
              const { accessToken, refreshToken: newRefreshToken } =
                response.data;

              localStorage.setItem("JWT_TOKEN", accessToken);

              if (newRefreshToken) {
                localStorage.setItem(
                  "REFRESH_TOKEN",
                  newRefreshToken
                );
              }

              api.defaults.headers.common.Authorization =
                `Bearer ${accessToken}`;

              return accessToken;
            })
            .finally(() => {
              isRefreshing = false;
            });
        }

        const newAccessToken = await refreshPromise;

        originalRequest.headers.Authorization =
          `Bearer ${newAccessToken}`;

        return api(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem("JWT_TOKEN");
        localStorage.removeItem("REFRESH_TOKEN");
        localStorage.removeItem("USER");

        window.location.href = "/login";

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;