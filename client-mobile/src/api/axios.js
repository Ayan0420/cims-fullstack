// src/api/axios.js
import axios from 'axios';
import { getToken } from './auth';
import { API_URL } from './config';

const api = axios.create({
    baseURL: API_URL + '/api',
});

api.interceptors.request.use((config) => {
    const token = getToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;
