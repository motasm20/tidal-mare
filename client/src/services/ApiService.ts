import axios from 'axios';
import { StorageService } from './StorageService';

const API_URL = 'http://localhost:3000/api'; // Configure via env later

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use((config) => {
    const token = StorageService.getToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
            // Handle unauthorized access (e.g., redirect to login)
            // For now, we might just throw or let the ViewModel handle it
        }
        return Promise.reject(error);
    }
);

export default api;
