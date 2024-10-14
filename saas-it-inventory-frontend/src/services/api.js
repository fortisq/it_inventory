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
  
  // Log all outgoing requests
  console.log(`Outgoing ${config.method.toUpperCase()} request to ${config.url}`, config.data);
  
  return config;
});

api.interceptors.response.use(
  (response) => {
    console.log('Response interceptor: Successful response', response.status);
    console.log('Response data:', response.data);
    return response;
  },
  (error) => {
    console.error('Response interceptor: Error in response', error.response ? error.response.status : 'No response');
    console.error('Error details:', error.response ? error.response.data : error.message);
    return Promise.reject(error);
  }
);

// Add a specific method for delete requests with extra logging
api.deleteWithLogging = async (url, config) => {
  console.log(`Initiating DELETE request to ${url}`);
  try {
    const response = await api.delete(url, config);
    console.log(`Successful DELETE request to ${url}`, response.data);
    return response;
  } catch (error) {
    console.error(`Error in DELETE request to ${url}`, error.response ? error.response.data : error.message);
    throw error;
  }
};

export default api;
