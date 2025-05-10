import axios from 'axios';
import { auth } from './firebase';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Regular API instance for JSON requests
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor: automatically add Authorization header if user is logged in
api.interceptors.request.use(async (config) => {
    const user = auth.currentUser;
    if (user) {
        const idToken = await user.getIdToken();
        config.headers['Authorization'] = `Bearer ${idToken}`;
    }
    return config;
}, (error) => Promise.reject(error));

// Upload API instance for multipart/form-data
const uploadApi = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'multipart/form-data',
    },
});

// Add auth interceptor to uploadApi as well
uploadApi.interceptors.request.use(async (config) => {
    const user = auth.currentUser;
    if (user) {
        const idToken = await user.getIdToken();
        config.headers['Authorization'] = `Bearer ${idToken}`;
    }
    return config;
}, (error) => Promise.reject(error));

export { api, uploadApi, API_URL }; 