import axios from 'axios';

// *** DEPLOYMENT FIX
const PROD_SERVER = import.meta.env.VITE_SERVER_URL || '';
const baseURL = PROD_SERVER ? `${PROD_SERVER}/api` : '/api';

const axiosInstance = axios.create({
    // We set the base URL for all API requests.
    // In production, this will be your live Render URL.
    // In development, this will be an empty string, and the Vite proxy will handle it.
    baseURL,
    withCredentials: true,  // automatically send cookies (for authentication)
});

export default axiosInstance;

