const mockApi = {
  login: jest.fn(() => Promise.resolve({ data: { token: 'mock-token', user: { id: '1', email: 'test@example.com' } } })),
  register: jest.fn(() => Promise.resolve({ data: { token: 'mock-token', user: { id: '1', email: 'test@example.com' } } })),
  getAssets: jest.fn(() => Promise.resolve({ data: [] })),
  getLicenses: jest.fn(() => Promise.resolve({ data: [] })),
  getCurrentUser: jest.fn(() => Promise.resolve({ data: { id: '1', email: 'test@example.com' } })),
  createTenant: jest.fn(() => Promise.resolve({ data: { id: '1', name: 'Test Tenant' } })),
  getTenants: jest.fn(() => Promise.resolve({ data: [] })),
};

module.exports = mockApi;
