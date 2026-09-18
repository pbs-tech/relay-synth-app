// Credentials come from cypress.env.json (gitignored) or CYPRESS_* env vars,
// so no account password lives in the repo. See cypress.env.example.json.
Cypress.Commands.add('userEmail', () => Cypress.env('userEmail'))

// Log in through the Pinia store rather than the login form, so specs that
// only need an authenticated session don't depend on the form's markup.
Cypress.Commands.add('loginByStore', () => {
    cy.visit('/')
    cy.window().its('userStore').then((userStore) =>
        userStore.login({
            email: Cypress.env('userEmail'),
            password: Cypress.env('userPassword')
        })
    )
    cy.window().its('userStore').its('isLoggedIn').should('eq', true)
})
