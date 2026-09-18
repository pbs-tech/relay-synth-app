module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
    es2021: true
  },
  // Without a parser config eslint fell back to ES5 script parsing, so every
  // `import` and every <template> block was a parse error.
  extends: [
    'plugin:vue/vue3-essential'
  ],
  rules: {
    // This codebase names its views after their routes (Home, Login, Play).
    // Renaming them all is a separate refactor, not a build fix.
    'vue/multi-word-component-names': 'off'
  },
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: 'module'
  },
  overrides: [
    {
      files: [
        '**/__tests__/*.{j,t}s?(x)',
        '**/tests/unit/**/*.unit.{j,t}s?(x)'
      ],
      env: {
        mocha: true
      }
    }
  ]
}
