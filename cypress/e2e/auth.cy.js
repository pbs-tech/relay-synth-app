// The API host is configurable so this spec can run against a local backend;
// it defaults to the same host the app itself calls.
const apiUrl = () => Cypress.env('apiUrl') || 'https://api.relay-synth.tech';

describe('JWT', () => {
    let user;
    let token;

    before(function fetchUser() {
        cy.request('POST', `${apiUrl()}/login`, {
            email: Cypress.env('userEmail'),
            password: Cypress.env('userPassword')
        }).its('body').then((res) => {
            user = res.user;
            token = res.token;
        })
    })

    beforeEach(function setUser() {
        cy.visit('/', {
            onBeforeLoad(win) {
                win.localStorage.setItem('user', JSON.stringify(user));
                win.localStorage.setItem('auth-token', token);
            }
        })
    })

    it('makes authenticated request', function() {
        cy.request({
            method: 'GET',
            url: `${apiUrl()}/user/profile`,
            body: { email: user.email },
            headers: { 'auth-token': token }
        })
        .its('body')
        .should('include', { email: Cypress.env('userEmail') })
    })

    it('Allows user onto routes requiring authentication', function() {
        // Previously reached into Pinia internals via pinia._s.get('user');
        // main.js now exposes the store directly under window.userStore.
        cy.window().its('userStore').then((userStore) =>
            userStore.login({
                email: Cypress.env('userEmail'),
                password: Cypress.env('userPassword')
            })
        )
        cy.window().its('userStore').its('isLoggedIn').should('eq', true);
        cy.visit('/tutorials');
    })
})
