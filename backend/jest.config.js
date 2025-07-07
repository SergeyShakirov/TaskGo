module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["**/__tests__/**/*.test.ts"],
  collectCoverageFrom: ["src/**/*.ts", "!src/**/*.d.ts", "!src/**/*.test.ts"],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  // Run tests serially to avoid port conflicts
  maxWorkers: 1,
  // Setup file to configure test environment
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  // Increase timeout for tests that start servers or use PDF generation
  testTimeout: 60000,
  // Transform options for better compatibility
  transform: {
    "^.+\\.ts$": "ts-jest",
  },
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
};
