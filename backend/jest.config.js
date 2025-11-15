module.exports = {
  testEnvironment: 'node',
  bail: 1,
  clearMocks: true,
  coverageDirectory: 'coverage',
  // Make sure this path is correct
  setupFilesAfterEnv: ['./src/tests/setup.js'],
  testTimeout: 30000,
};