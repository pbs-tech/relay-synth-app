module.exports = {
  root: true,
  env: {
    node: true,
    browser: true,
    es2021: true
  },
  extends: [
    'plugin:vue/vue3-essential',
    'eslint:recommended'
  ],
  parserOptions: {
    parser: '@babel/eslint-parser',
    ecmaVersion: 2021,
    sourceType: 'module',
    requireConfigFile: false
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-unused-vars': ['error', { args: 'none' }],
    // Route-level views are single-word by design (Home, Play, 404); renaming
    // them all would churn the router for no benefit.
    'vue/multi-word-component-names': 'off'
  },
  overrides: [
    {
      files: [
        '**/__tests__/*.{j,t}s?(x)',
        '**/tests/unit/**/*.unit.{j,t}s?(x)',
        '**/cypress/**/*.{j,t}s?(x)'
      ],
      env: {
        mocha: true
      },
      globals: {
        cy: 'readonly',
        Cypress: 'readonly',
        // Cypress bundles chai as globals
        expect: 'readonly',
        assert: 'readonly'
      }
    }
  ]
}
