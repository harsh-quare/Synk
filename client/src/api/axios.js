import axios from 'axios';

// Create a configured axios instance for API requests
const axiosInstance = axios.create({
    baseURL: '/api', // Requests are proxied to backend by Vite during development
    withCredentials: true, // Automatically send cookies (for authentication)
});

export default axiosInstance;