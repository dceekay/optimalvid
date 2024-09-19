// jest.config.js
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom', // Simulate browser environment
  transform: {
    '^.+\\.tsx?$': 'ts-jest', // Use ts-jest for transforming TypeScript and JSX files
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  transformIgnorePatterns: ['/node_modules/'],
};
