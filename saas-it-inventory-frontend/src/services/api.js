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

export const login = async (username, password) => {
  console.log("Sending login request to:", `${API_URL}/auth/login`);
  try {
    const response = await api.post('/auth/login', { username, password });
    console.log("Login response:", response);
    return response;
  } catch (error) {
    console.error("Login error:", error.response || error);
    throw error;
  }
};

export const register = (userData) => api.post('/auth/register', userData);
export const getCurrentUser = () => api.get('/auth/current-user');
export const updateUserProfile = (userData) => api.put('/auth/update-profile', userData);

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

export const getSubscription = () => api.get('/subscriptions');
export const createCheckoutSession = (plan) => api.post('/subscriptions/create-checkout-session', { plan });
export const getInvoiceHistory = () => api.get('/subscriptions/invoices');
export const getPaymentMethods = () => api.get('/subscriptions/payment-methods');

export const getSoftwareSubscriptions = () => api.get('/software-subscriptions');
export const createSoftwareSubscription = (subscriptionData) => api.post('/software-subscriptions', subscriptionData);
export const updateSoftwareSubscription = (id, subscriptionData) => api.put(`/software-subscriptions/${id}`, subscriptionData);
export const deleteSoftwareSubscription = (id) => api.delete(`/software-subscriptions/${id}`);

export const getSystemHealth = () => api.get('/health');

export const getReports = () => api.get('/reports');
export const getReport = (id) => api.get(`/reports/${id}`);
export const generateReport = (id) => api.post(`/reports/${id}/generate`);

export const getHelpDocuments = () => api.get('/help/documents');
export const getHelpRequests = () => api.get('/help/requests');
export const createHelpRequest = (requestData) => api.post('/help/requests', requestData);
export const updateHelpRequest = (id, requestData) => api.put(`/help/requests/${id}`, requestData);

export const getUserNotifications = () => api.get('/help/notifications/user');
export const getAdminNotifications = () => api.get('/help/notifications/admin');

export const getInventory = () => api.get('/inventory');
export const getInventoryItem = (id) => api.get(`/inventory/${id}`);
export const createInventoryItem = (itemData) => api.post('/inventory', itemData);
export const updateInventoryItem = (id, itemData) => api.put(`/inventory/${id}`, itemData);
export const deleteInventoryItem = (id) => api.delete(`/inventory/${id}`);

export default api;
