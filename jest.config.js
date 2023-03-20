module.exports = {
  testMatch: ["**/*.test.js"],
  testEnvironment: "jest-environment-jsdom-fourteen",
  setupFilesAfterEnv: ["jest-canvas-mock"],
};
