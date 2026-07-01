import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

console.log("API URL:", API_URL);

// Create an Axios instance
const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: true,
});

// Add a request interceptor to include JWT and CSRF tokens
api.interceptors.request.use(
  async (config) => {
    const token = localStorage.getItem("JWT_TOKEN");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    let csrfToken = localStorage.getItem("CSRF_TOKEN");

    if (!csrfToken) {
      try {
        const response = await axios.get(`${API_URL}/api/csrf-token`, {
          withCredentials: true,
        });

        csrfToken = response.data.token;
        localStorage.setItem("CSRF_TOKEN", csrfToken);
      } catch (error) {
        console.error("Failed to fetch CSRF token", error);
      }
    }

    if (csrfToken) {
      config.headers["X-XSRF-TOKEN"] = csrfToken;
    }

    console.log("X-XSRF-TOKEN:", csrfToken);

    return config;
  },
  (error) => Promise.reject(error)
);

export default api;