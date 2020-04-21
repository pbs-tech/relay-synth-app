beforeEach(function(){ 
        email = `test${Date.now()}@test.com`
})

describe('/signup', function() {

    it('Signs user up with valid credentials', function() {
        cy.visit('/Signup');
        cy.contains('Signup');
        cy.contains('Email').type(email);
        cy.contains('Password').type('Password1234!');
        cy.contains('Repeat Password').type('Password1234!');
        cy.get('#signup-user').click();
        cy.url().should('include','/');

    })
    
    it('Displays error if invalid email', function() {
        cy.visit('/signup');
        cy.contains('Email').type('Not an email');
        cy.contains('Password').type('Password1234!');
        cy.contains('Repeat Password').type('Password1234!');
        cy.get('#signup-user').click();
        cy.contains('Must be a valid email');
        cy.contains('Could not create an account');
    })
    it('Displays error if incorrect repeated password', function() {
        cy.visit('/signup');
        cy.contains('Email').type(email);
        cy.contains('Password').type('Password1234!');
        cy.contains('Repeat Password').type('NotPassword1234!');
        cy.get('#signup-user').click();
        cy.contains('Could not create an account');
        cy.contains('Passwords must match');
    })
    it('Displays error if no repeated password', function() {
        cy.visit('/signup');
        cy.contains('Email').type(email);
        cy.contains('Password').type('Password1234!');
        cy.get('#signup-user').click();
        cy.contains('Could not create an account');
        cy.contains('Passwords must match');
    })

    it('Displays error if repeated email user', function() {
        cy.visit('/Signup');
        cy.contains('Signup');
        cy.contains('Email').type(email);
        cy.contains('Password').type('Password1234!');
        cy.contains('Repeat Password').type('Password1234!');
        cy.get('#signup-user').click();
        cy.url().should('include','/');
        cy.visit('/Signup');
        cy.contains('Signup');
        cy.contains('Email').type(email);
        cy.contains('Password').type('Password1234!');
        cy.contains('Repeat Password').type('Password1234!');
        cy.get('#signup-user').click();
        cy.contains('Could not create an account');


    })

    it('Redirects to Login', function() {
        cy.visit('/signup');
        cy.get('#login-redirect').click();
        cy.url().should('include','/login');
    })

})