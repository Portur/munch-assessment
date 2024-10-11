import type { Config } from 'jest'

const configuration: Config = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: '.',
  testMatch: ['<rootDir>/test/**/*.test.ts'],
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  verbose: true,
  collectCoverageFrom: ['**/*.(t|j)s'],
  testPathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/dist/',
  ],
  moduleNameMapper: {
    '^~/(.*)$': '<rootDir>/src/$1',
    '^@modules/app(.*)$': '<rootDir>/src/modules/$1',
    '^@common/filters(.*)$': '<rootDir>/src/common/$1',
  },
  coveragePathIgnorePatterns: [
    '.*\\.(interface|module|schema|entity|dto|enum|d).ts',
    'index.ts',
  ],
  coverageDirectory: './coverage',
  testEnvironment: 'node',
  roots: ['<rootDir>/test'],
}

export default configuration