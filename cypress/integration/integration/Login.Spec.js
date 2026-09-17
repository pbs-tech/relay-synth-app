// Credentials come from cypress.env.json (git-ignored) or CYPRESS_* env vars.
// See cypress.env.example.json.
const testEmail = Cypress.env('testEmail');
const testPassword = Cypress.env('testPassword');

describe('/login', function() {


    it('Logs user in with valid credentials', function() {
        cy.visit('/Login');
        cy.contains('Login');
        cy.contains('Email').type(testEmail);
        cy.contains('Password').type(testPassword);
        cy.get('#login-user').click();
        cy.url().should('include','/');
    })
    it('Displays error if invalid email', function() {
        cy.visit('/Login');
        cy.contains('Email').type('not-a-real-user@example.com');
        cy.contains('Password').type(testPassword);
        cy.get('#login-user').click();
        cy.contains('Invalid email or password');
    })
    it('Displays error if invalid password', function() {
        cy.visit('/Login');
        cy.contains('Email').type(testEmail);
        cy.contains('Password').type('not-the-right-password');
        cy.get('#login-user').click();
        cy.contains('Invalid email or password');
    })
    it('Displays error if invalid email and password', function() {
        cy.visit('/Login');
        cy.contains('Email').type('not-a-real-user@example.com');
        cy.contains('Password').type('not-the-right-password');
        cy.get('#login-user').click();
        cy.contains('Invalid email or password');
    })
    it('Redirects to signup', function() {
        cy.visit('/Login');
        cy.get('#signup-redirect').click();
        cy.url().should('include','/signup');
    })
    it('User can login and logout', function() {
        cy.visit('/Login');
        cy.contains('Login');
        cy.contains('Email').type(testEmail);
        cy.contains('Password').type(testPassword);
        cy.get('#login-user').click();
        cy.url().should('include','/');
        cy.get('#logout-button').click();
        cy.get('#login-button');
        cy.get('#signup-button');

    })

})