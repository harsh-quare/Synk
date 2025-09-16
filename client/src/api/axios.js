import axios from 'axios';

// *** DEPLOYMENT FIX
const axiosInstance = axios.create({
    // We set the base URL for all API requests.
    // In production, this will be your live Render URL.
    // In development, this will be an empty string, and the Vite proxy will handle it.
    baseURL: import.meta.env.VITE_SERVER_URL || 'http://localhost:3001',
    withCredentials: true,  // automatically send cookies (for authentication)
});

export default axiosInstance;

