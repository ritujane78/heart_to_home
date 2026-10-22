import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;
const API_BASE_URL = `${API_URL}/api`;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: true,
  withXSRFToken: false,
});

let csrfPromise;
let refreshPromise;
let csrfHeaderToken;

const clearLocalSession = () => {
  localStorage.removeItem("JWT_TOKEN");
  localStorage.removeItem("REFRESH_TOKEN");
  localStorage.removeItem("USER");
  localStorage.removeItem("IS_ADMIN");
};

const ensureCsrfCookie = async () => {
  if (!csrfPromise) {
    csrfPromise = axios
      .get(`${API_BASE_URL}/csrf-token`, { withCredentials: true })
      .then(({ data }) => {
        csrfHeaderToken = data.token;
        return csrfHeaderToken;
      })
      .finally(() => {
        csrfPromise = null;
      });
  }

  return csrfPromise;
};

const refreshAccessToken = () => {
  if (!refreshPromise) {
    refreshPromise = api
      .post("/auth/public/refresh-token", null, { _skipAuthRefresh: true })
      .then(({ data }) => {
        localStorage.setItem("JWT_TOKEN", data.accessToken);
        api.defaults.headers.common.Authorization = `Bearer ${data.accessToken}`;
        return data.accessToken;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
};

api.interceptors.request.use(async (config) => {
  const method = (config.method || "get").toLowerCase();
  if (!["get", "head", "options"].includes(method)) {
    await ensureCsrfCookie();
    config.headers["X-XSRF-TOKEN"] = csrfHeaderToken;
  }

  const token = localStorage.getItem("JWT_TOKEN");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const isRefreshRequest = originalRequest?.url?.includes("/auth/public/refresh-token");

    if (
      error.response?.status === 403 &&
      originalRequest &&
      !originalRequest._csrfRetry &&
      !["get", "head", "options"].includes((originalRequest.method || "get").toLowerCase())
    ) {
      originalRequest._csrfRetry = true;
      csrfHeaderToken = null;
      csrfPromise = null;
      await ensureCsrfCookie();
      originalRequest.headers["X-XSRF-TOKEN"] = csrfHeaderToken;
      return api(originalRequest);
    }

    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !originalRequest._skipAuthRefresh &&
      !isRefreshRequest &&
      originalRequest.headers?.Authorization
    ) {
      originalRequest._retry = true;

      try {
        const newAccessToken = await refreshAccessToken();
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        if (refreshError.response?.status === 401) {
          clearLocalSession();
          window.location.href = "/login";
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export { refreshAccessToken };
export default api;
