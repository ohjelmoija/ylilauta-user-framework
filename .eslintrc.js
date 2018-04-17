module.exports = {
  env: {
    browser: true,
    es6: true,
    jquery: true
  },
  extends: 'eslint:recommended',
  parserOptions: {
    sourceType: 'module'
  },
  rules: {
    indent: ['error', 2],
    'linebreak-style': ['error', 'windows'],
    quotes: ['error', 'single'],
    semi: ['error', 'always'],
    'no-console': ["error", { allow: ["warn", "error", "log"] }]
  }
};
