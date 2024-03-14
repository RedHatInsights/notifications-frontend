const transformIgnorePatterns = ['node_modules/(?!(uuid)/)'];

/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  coverageDirectory: './coverage/',
  collectCoverage: true,
  collectCoverageFrom: ['src/**/*.js', '!src/**/stories/*'],
  roots: ['<rootDir>/src/'],
  moduleNameMapper: {
    '\\.(css|scss|svg)$': 'identity-obj-proxy',
    '@openshift/*': 'jest-transform-stub',
  },
  transformIgnorePatterns,
  setupFilesAfterEnv: ['<rootDir>/config/setupTests.ts'],
};
