describe('Nav (routes with no auth required)', function() {
    it('Opens navigation drawer', function() {
        cy.visit('/');
        cy.get('#drawer').click();
    })
    it('Closes navigation drawer', function() {
        cy.visit('/');
        cy.get('#drawer').click();
        cy.get('#drawer').click();
    })

    it('Visits About', function() {
        cy.visit('/');
        cy.get('#drawer').click();
        cy.contains('About').click();
        cy.url().should('include','/about');
        cy.contains('About');
    })
    // Login and Signup are Auth0 Universal Login now, not in-app pages, so both
    // buttons leave the origin entirely. There is nothing to assert here beyond
    // arriving at the tenant's authorize endpoint - the rest is Auth0's to test.
    it('Sends Login to Auth0', function() {
        cy.visit('/');
        cy.get('#login-button').click();
        cy.origin(`https://${Cypress.env('auth0Domain')}`, () => {
            cy.url().should('include', '/authorize');
        })
    })
    it('Sends Signup to Auth0', function() {
        cy.visit('/');
        cy.get('#signup-button').click();
        cy.origin(`https://${Cypress.env('auth0Domain')}`, () => {
            cy.url().should('include', 'screen_hint=signup');
        })
    })
})

describe('Nav (routes with auth required)', function() {
    beforeEach(function() {
        cy.loginByAuth0();
        cy.get('#drawer').click();
    })

    it('Should go to Tutorials', function() {
        cy.contains('Tutorials').click();
        cy.url().should('include','/tutorials');
        cy.contains('Tutorials');
    })
    it('Should go to Leaderboard', function() {
        cy.contains('Leaderboard').click();
        cy.url().should('include','/leaderboard');
        cy.contains('Leaderboard');
    })
    it('Should allow the user to navigate to the tutorials via the homepage', function() {
        cy.get('#drawer').click();
        cy.get('#tutorial-button').click();
        cy.contains('Tutorials');
    })
    it('Should logout', function() {
        cy.get('#drawer').click();
        cy.get('#logout-button').click();
        cy.get('#login-button');
        cy.get('#signup-button');
    })
})
