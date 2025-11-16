module.exports = {
  testEnvironment: 'node',
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/config/**',
    '!src/views/**',
    '!src/app.js',
    '!server.js',
  ],
  testMatch: [
    '**/tests/**/*.test.js',
  ],
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
  verbose: true,
};

