import axios, { InternalAxiosRequestConfig } from 'axios';
import config from './config';

const api = axios.create({
  baseURL: config.backendUrl,
});

api.interceptors.request.use(
  (request: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('token');
    console.log(token);
    if (token) {
      request.headers.Authorization = `Bearer ${token}`;
    }
    return request;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;

