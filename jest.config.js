module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/test/**/*.spec.ts'],
  moduleFileExtensions: ['ts', 'js'],
  transform: {
    '^.+\\.ts$': 'ts-jest'
  },
  moduleNameMapper: {
    '^@providers/(.*)$': '<rootDir>/src/providers/$1',
    '^@usecases/(.*)$': '<rootDir>/src/usecases/$1',
    '^@ports/(.*)$': '<rootDir>/src/ports/$1',
    '^@test/(.*)$': '<rootDir>/test/$1',
    '^@docs/(.*)$': '<rootDir>/docs/$1',
    '^@helpers/(.*)$': '<rootDir>/src/helpers/$1'
  },
  collectCoverageFrom: [
    '**/src/**/*.ts',
    '!**/src/types/**',
    '!**/src/server.ts',
    '!**/src/helpers/errors/**',
    '!**/src/usecases/shared/error.ts',
    '!**/src/ports/**',
    '!**/src/providers/prisma/fake-data.ts',
    '!**/src/providers/express/server.ts',
    '!**/src/providers/pino/**',
    '!**/src/providers/express/middlewares/mappedDiagnosticContext.ts',
    '!**/src/providers/express/middlewares/sanitizeMiddleware.ts',
    '!**/test/**'
  ]
};
