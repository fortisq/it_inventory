import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const login = (email, password) => api.post('/auth/login', { email, password });
export const register = (userData) => api.post('/auth/register', userData);

export const getAssets = () => api.get('/assets');
export const createAsset = (assetData) => api.post('/assets', assetData);
export const updateAsset = (id, assetData) => api.put(`/assets/${id}`, assetData);
export const deleteAsset = (id) => api.delete(`/assets/${id}`);

export const getLicenses = () => api.get('/licenses');
export const createLicense = (licenseData) => api.post('/licenses', licenseData);
export const updateLicense = (id, licenseData) => api.put(`/licenses/${id}`, licenseData);
export const deleteLicense = (id) => api.delete(`/licenses/${id}`);

export const getTenants = () => api.get('/tenants');
export const createTenant = (tenantData) => api.post('/tenants', tenantData);
export const updateTenant = (id, tenantData) => api.put(`/tenants/${id}`, tenantData);
export const deleteTenant = (id) => api.delete(`/tenants/${id}`);

export const getUsers = () => api.get('/users');
export const createUser = (userData) => api.post('/users', userData);
export const updateUser = (id, userData) => api.put(`/users/${id}`, userData);
export const deleteUser = (id) => api.delete(`/users/${id}`);

// Methods for AdminDashboard
export const getTenantStats = () => api.get('/stats/tenants');
export const getUserStats = () => api.get('/stats/users');
export const getAssetStats = () => api.get('/stats/assets');

// Methods for SubscriptionManagement
export const getSubscription = () => api.get('/subscriptions');
export const createCheckoutSession = (plan) => api.post('/subscriptions/create-checkout-session', { plan });
export const getInvoiceHistory = () => api.get('/subscriptions/invoices');
export const getPaymentMethods = () => api.get('/subscriptions/payment-methods');

export default api;
