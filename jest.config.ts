import { defaults } from "jest-config";

module.exports = {
  testEnvironment: "miniflare", // ✨
  // Tell Jest to look for tests in .mjs files too
  testMatch: [
    "**/__tests__/**/*.?(m)[jt]s?(x)",
    "**/?(*.)+(spec|test).?(m)[tj]s?(x)",
  ],
  moduleFileExtensions: ["mjs", ...defaults.moduleFileExtensions],
};
