module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2017: true
  },
  plugins: ['prettier'],
  extends: ['eslint:recommended', 'plugin:prettier/recommended'],
  parserOptions: {
    ecmaVersion: 8
  },
  rules: {
    'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    quotes: [
      1,
      'single',
      {
        allowTemplateLiterals: true,
        avoidEscape: true,
      },
    ],
  }
}
