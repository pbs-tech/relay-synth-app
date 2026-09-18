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
    it('Visits Login', function() {
        cy.visit('/');
        cy.get('#login-button').click();
        cy.url().should('include','/login');
        cy.contains('Login');
    })
    it('Visits Signup', function() {
        cy.visit('/');
        cy.get('#signup-button').click();
        cy.url().should('include','/signup');
        cy.contains('Signup');
    })
})

describe('Nav (routes with auth required)', function() {
    beforeEach(function() {
        cy.loginByStore();
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
