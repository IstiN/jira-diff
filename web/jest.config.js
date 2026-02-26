/** @type {import('jest').Config} */
module.exports = {
    testEnvironment: 'node',
    collectCoverageFrom: [
        'js/**/*.js',
        'scripts/**/*.js',
        '!**/node_modules/**',
        '!js/greeting-browser.js'
    ],
    coverageThreshold: {
        global: {
            branches: 100,
            functions: 100,
            lines: 100,
            statements: 100
        }
    }
};
