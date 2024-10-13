const config = {
  apiUrl: process.env.REACT_APP_API_URL || 'http://localhost:3000/api',
  environment: process.env.NODE_ENV || 'development',
  version: process.env.REACT_APP_VERSION || '1.0.0',
};

export default config;
