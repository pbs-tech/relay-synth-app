# webproject-app

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Runs the unit tests
```
npm run test:unit
```

### End-to-end tests
The Cypress specs under `cypress/` are **not currently runnable**: the `cypress`
package is not a dependency and the layout (`cypress.json`, `cypress/integration`,
`cypress/plugins`) targets Cypress <= 9. Wiring them back up means installing a
current Cypress, moving the specs to `cypress/e2e`, replacing `cypress.json` with
`cypress.config.js`, and re-adding `@cypress/code-coverage`. The spec sources
themselves have been updated to read state from Pinia rather than Vuex.

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
