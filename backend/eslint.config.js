module.exports = {
  root: true, // Ensures this configuration is used for this package
  env: {
    node: true, // Enable Node.js global variables and Node.js scoping
    es6: true, // Enable ES6 syntax
  },
  extends: [
    "eslint:recommended", // Use ESLint's recommended rules
    // Add any other base configurations you want to extend
  ],
  parserOptions: {
    ecmaVersion: 2020, // Allows parsing of modern ECMAScript features
  },
  rules: {
    // Add or override specific ESLint rules here
    "no-console": "off", // Example: Allow console.log in Node.js environment
    // Define other custom rules as needed
  },
};
