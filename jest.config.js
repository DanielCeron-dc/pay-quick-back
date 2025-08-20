module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src', '<rootDir>/test'],
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    '<rootDir>/src/**/*.ts',
    '!<rootDir>/src/main.ts',
    '!<rootDir>/src/app.module.ts',
    '!<rootDir>/src/**/*.module.ts',
    '!<rootDir>/src/**/*.dto.ts'
  ],
  coverageThreshold: {
    global: {
      statements: 80,
      branches: 60,
      functions: 70,
      lines: 80,
    },
  },
  moduleFileExtensions: ['ts', 'js', 'json'],
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
};