describe('/login', function() {
    beforeEach(function() {
        cy.visit('/login');
    })

    it('Logs user in with valid credentials', function() {
        cy.contains('Login');
        cy.get('#login-email-field').type(Cypress.env('userEmail'));
        cy.get('#login-password-field').type(Cypress.env('userPassword'));
        cy.get('#login-user').click();
        cy.url().should('include','/');
    })
    it('Displays error if invalid email', function() {
        cy.get('#login-email-field').type('wrong@example.com');
        cy.get('#login-password-field').type(Cypress.env('userPassword'));
        cy.get('#login-user').click();
        cy.contains('Invalid email or password');
    })
    it('Displays error if invalid password', function() {
        cy.get('#login-email-field').type(Cypress.env('userEmail'));
        cy.get('#login-password-field').type('Incorrect password');
        cy.get('#login-user').click();
        cy.contains('Invalid email or password');
    })
    it('Displays error if invalid email and password', function() {
        cy.get('#login-email-field').type('wrong@example.com');
        cy.get('#login-password-field').type('Incorrect password');
        cy.get('#login-user').click();
        cy.contains('Invalid email or password');
    })
    it('Redirects to signup', function() {
        cy.get('#signup-redirect').click();
        cy.url().should('include','/signup');
    })
    it('User can login and logout', function() {
        cy.get('#login-email-field').type(Cypress.env('userEmail'));
        cy.get('#login-password-field').type(Cypress.env('userPassword'));
        cy.get('#login-user').click();
        cy.url().should('include','/');
        cy.get('#logout-button').click();
        cy.get('#login-button');
        cy.get('#signup-button');
    })
})
