/**
 * Auth0 Universal Login is hosted on the tenant's own domain, so it cannot be
 * driven from Cypress without cross-origin gymnastics that test Auth0 rather
 * than this app. Specs instead exchange credentials for a token directly and
 * hand it to the running app, the approach Auth0 documents for end-to-end tests.
 *
 * Prerequisites on the tenant (see README > Auth0 setup):
 *   - the Password grant enabled on the application
 *   - a Default Directory set to the database connection
 *
 * Credentials come from cypress.env.json (gitignored) or CYPRESS_* env vars, so
 * nothing secret lives in the repo. See cypress.env.example.json.
 */

Cypress.Commands.add('userEmail', () => Cypress.env('userEmail'))

/** Fetches an access token from Auth0 with the resource owner password grant. */
Cypress.Commands.add('auth0Token', () => {
    const domain = Cypress.env('auth0Domain')
    const clientId = Cypress.env('auth0ClientId')
    const audience = Cypress.env('auth0Audience')

    if (!domain || !clientId || !audience) {
        throw new Error(
            'Missing Auth0 e2e configuration: set auth0Domain, auth0ClientId ' +
                'and auth0Audience in cypress.env.json. See cypress.env.example.json.'
        )
    }

    return cy
        .request({
            method: 'POST',
            url: `https://${domain}/oauth/token`,
            body: {
                grant_type: 'password',
                username: Cypress.env('userEmail'),
                password: Cypress.env('userPassword'),
                audience,
                scope: 'openid profile email',
                client_id: clientId
            }
        })
        .its('body.access_token')
})

/**
 * Visits the app as a signed-in user.
 *
 * Replaces `loginByStore`, which called the removed `userStore.login` action
 * against the deleted POST /login endpoint. The token is injected before the
 * app boots so the very first request already carries it.
 */
Cypress.Commands.add('loginByAuth0', () => {
    cy.auth0Token().then((accessToken) => {
        cy.visit('/', {
            onBeforeLoad(win) {
                // Runs before main.js, which applies this before mounting - and
                // so before session restoration reads it. Setting it afterwards
                // would be too late: restoration is memoised and would already
                // have settled on a logged-out session.
                win.__injectedAccessToken = accessToken
            }
        })

        cy.window().its('userStore').its('isLoggedIn').should('eq', true)
    })
})
