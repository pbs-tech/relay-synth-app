const { defineConfig } = require('cypress')

module.exports = defineConfig({
  e2e: {
    baseUrl: 'https://localhost:8080',
    waitForAnimations: false,
    // Cypress 10 replaced cypress/plugins/index.js with this hook.
    setupNodeEvents(on, config) {
      require('@cypress/code-coverage/task')(on, config)
      return config
    }
  }
})
