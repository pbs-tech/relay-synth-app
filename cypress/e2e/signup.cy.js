describe('/signup', function() {
    // `email` was previously an implicit global assigned in a top-level
    // beforeEach, which throws under strict mode.
    let email;

    beforeEach(function() {
        email = `test${Date.now()}@test.com`;
        cy.visit('/signup');
    })

    it('Signs user up with valid credentials', function() {
        cy.contains('Signup');
        cy.get('#signup-email-field').type(email);
        cy.get('#signup-password-field').type('Password1234!');
        cy.get('#signup-repeat-password-field').type('Password1234!');
        cy.get('#signup-user').click();
        cy.url().should('include','/');
    })

    it('Displays error if invalid email', function() {
        cy.get('#signup-email-field').type('Not an email');
        cy.get('#signup-password-field').type('Password1234!');
        cy.get('#signup-repeat-password-field').type('Password1234!');
        cy.get('#signup-user').click();
        cy.contains('Must be a valid email');
        cy.contains('Could not create an account');
    })
    it('Displays error if incorrect repeated password', function() {
        cy.get('#signup-email-field').type(email);
        cy.get('#signup-password-field').type('Password1234!');
        cy.get('#signup-repeat-password-field').type('NotPassword1234!');
        cy.get('#signup-user').click();
        cy.contains('Could not create an account');
        cy.contains('Passwords must match');
    })
    it('Displays error if no repeated password', function() {
        cy.get('#signup-email-field').type(email);
        cy.get('#signup-password-field').type('Password1234!');
        cy.get('#signup-user').click();
        cy.contains('Could not create an account');
        cy.contains('Passwords must match');
    })

    it('Displays error if repeated email user', function() {
        cy.get('#signup-email-field').type(email);
        cy.get('#signup-password-field').type('Password1234!');
        cy.get('#signup-repeat-password-field').type('Password1234!');
        cy.get('#signup-user').click();
        cy.url().should('include','/');

        cy.visit('/signup');
        cy.get('#signup-email-field').type(email);
        cy.get('#signup-password-field').type('Password1234!');
        cy.get('#signup-repeat-password-field').type('Password1234!');
        cy.get('#signup-user').click();
        cy.contains('Could not create an account');
    })

    it('Redirects to Login', function() {
        cy.get('#login-redirect').click();
        cy.url().should('include','/login');
    })
})
