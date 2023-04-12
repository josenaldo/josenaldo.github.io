const config = {
  roots: ['<rootDir>/src/'],
  verbose: true,
  testEnvironment: 'jest-environment-jsdom',
  setupFilesAfterEnv: ['<rootDir>/.jest/setup-tests.js'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '\\.(gif|ttf|eot|svg|png)$': '<rootDir>/.jest/__mocks__/fileMock.js',
    '\\.(css|less|sass|scss)$': 'identity-obj-proxy',
  },
  transformIgnorePatterns: ['/node_modules/(?!deep-freeze-es6)'],
  collectCoverage: true,
  coverageReporters: ['json', 'html'],
}

export default config
