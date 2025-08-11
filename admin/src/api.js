import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:3000/api',
    withCredentials: true,
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            // For simplicity and to ensure a clean state, we'll do a hard redirect to the login page.
            // This will clear all component state. The backend will have already cleared the auth cookie.
            window.location.href = '/';
        }
        return Promise.reject(error);
    }
);

export default api;
