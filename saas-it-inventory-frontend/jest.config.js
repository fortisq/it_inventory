module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],
  moduleNameMapper: {
    '\\.(css|less|sass|scss)$': '<rootDir>/__mocks__/styleMock.js',
    '\\.(gif|ttf|eot|svg)$': '<rootDir>/__mocks__/fileMock.js',
    '^src/services/api$': '<rootDir>/src/__mocks__/api.js'
  },
  transform: {
    '^.+\\.(js|jsx)$': 'babel-jest',
  },
};
