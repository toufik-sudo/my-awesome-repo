module.exports = {
  preset: 'jest-puppeteer',
  globals: {
    URL: 'http://localhost:3030'
  },
  testMatch: ['**/e2e/**/*.test.ts'],
  verbose: true
};
