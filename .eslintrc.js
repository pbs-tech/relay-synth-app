module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
    es2021: true
  },
  // Without a parser config eslint fell back to ES5 script parsing, so every
  // `import` and every <template> block was a parse error.
  // vue3-essential alone only catches Vue-specific correctness errors, so the
  // gate said nothing about plain JS. eslint:recommended adds the core checks -
  // unused bindings, switch-case scope leaks, unguarded hasOwnProperty.
  //
  // The vue3-strongly-recommended and vue3-recommended tiers are deliberately
  // not here: they are ~1200 formatting findings (712 html-indent alone) and
  // ship as warnings, so they would not fail CI anyway. Adopting either means
  // reflowing every template, which belongs in its own commit, not a CI change.
  extends: [
    'eslint:recommended',
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
    },
    {
      files: ['cypress/**/*.{j,t}s'],
      env: {
        mocha: true
      },
      globals: {
        cy: 'readonly',
        Cypress: 'readonly'
      }
    }
  ]
}
