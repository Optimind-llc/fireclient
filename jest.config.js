module.exports = {
  moduleFileExtensions: ["js", "jsx", "json", "vue"],
  transform: {
    "^.+\\.(js|jsx)?$": "babel-jest",
  },
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  testMatch: ["<rootDir>/src/__tests__/**/*.jsx"],
  transformIgnorePatterns: ["<rootDir>/node_modules/"],
};
