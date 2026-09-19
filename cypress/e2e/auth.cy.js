/**
 * Auth0 bearer-token access.
 *
 * Replaces the old JWT spec, which logged in through POST /login and sent the
 * token in an `auth-token` header. Both are gone: Auth0 mints the token and the
 * API expects `Authorization: Bearer`.
 */

// The API host is configurable so this spec can run against a local backend;
// it defaults to the same host the app itself calls.
const apiUrl = () => Cypress.env('apiUrl') || 'https://api.relay-synth.peebles.lol';

describe('Auth0 access tokens', () => {
    let token;

    before(function fetchToken() {
        cy.auth0Token().then((accessToken) => {
            token = accessToken;
        })
    })

    it('makes an authenticated request with a bearer token', function() {
        cy.request({
            method: 'GET',
            url: `${apiUrl()}/user/profile`,
            headers: { Authorization: `Bearer ${token}` }
        })
        .its('body')
        .should('include', { email: Cypress.env('userEmail') })
    })

    it('rejects a request with no token', function() {
        cy.request({
            method: 'GET',
            url: `${apiUrl()}/user/profile`,
            failOnStatusCode: false
        })
        .its('status')
        .should('eq', 401)
    })

    it('allows a signed-in user onto routes requiring authentication', function() {
        cy.loginByAuth0();
        cy.visit('/tutorials');
        cy.contains('Tutorials');
    })

    it('keeps a signed-out user off routes requiring authentication', function() {
        // Universal Login lives on the Auth0 domain, so the guard's redirect
        // takes the browser off-origin. Asserting the origin changed is all
        // this can check without testing Auth0 itself.
        cy.visit('/leaderboard');
        cy.origin(`https://${Cypress.env('auth0Domain')}`, () => {
            cy.url().should('include', '/authorize');
        })
    })
})
