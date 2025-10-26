// In API/axios.js
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://evangadiform-backend-deploy.onrender.com/api",
  timeout: 10000,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
