import axios from 'axios';
import { API_URL } from './config';

export async function login(email, password) {
    const { data } = await axios.post(`${API_URL}/api/auth/login`, {
        email,
        password,
    });
    localStorage.setItem('token', data.token);
    return data;
}

export function getToken() {
    return localStorage.getItem('token');
}

export function removeToken() {
    localStorage.removeItem('token');
}