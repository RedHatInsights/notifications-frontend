module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'jsdom',
    coverageDirectory: './coverage',
    collectCoverageFrom: [
        'src/**/*.{ts,tsx}',
        '!**/node_modules/**',
        '!test/**'
    ],
    coveragePathIgnorePatterns: [
        '<rootDir>/src/utils/Expression/*'
    ],
    setupFiles: [
        '<rootDir>/config/setupTests.ts'
    ],
    setupFilesAfterEnv: [
        '<rootDir>/config/setupTestFramework.ts'
    ],
    roots: [
        '<rootDir>/src/',
        '<rootDir>/test/'
    ],
    moduleNameMapper: {
        '.+\\.(css|scss|styl|less|sass|scss|png|jpg|ttf|woff|woff2|svg)$': 'jest-transform-stub'
    }
};
