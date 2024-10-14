import axios from 'axios';
import config from '../config';

const api = axios.create({
  baseURL: config.apiUrl,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    console.log('Request interceptor: Adding token to request', token);
  } else {
    console.log('Request interceptor: No token found in localStorage');
  }
  return config;
});

api.interceptors.response.use(
  (response) => {
    console.log('Response interceptor: Successful response', response.status);
    return response;
  },
  (error) => {
    console.error('Response interceptor: Error in response', error.response ? error.response.status : 'No response');
    console.error('Error details:', error.response ? error.response.data : error.message);
    return Promise.reject(error);
  }
);

export default api;
