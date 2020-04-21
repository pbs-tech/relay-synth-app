describe('/login', function() {


    it('Logs user in with valid credentials', function() {
        cy.visit('/Login');
        cy.contains('Login');
        cy.contains('Email').type('alex_peebles@outlook.com');
        cy.contains('Password').type('***REMOVED***');
        cy.get('#login-user').click();
        cy.url().should('include','/');
    })
    it('Displays error if invalid email', function() {
        cy.visit('/Login');
        cy.contains('Email').type('not_alex_peebles@outlook.com');
        cy.contains('Password').type('***REMOVED***');
        cy.get('#login-user').click();
        cy.contains('Invalid email or password');
    })
    it('Displays error if invalid password', function() {
        cy.visit('/Login');
        cy.contains('Email').type('alex_peebles@outlook.com');
        cy.contains('Password').type('Incorrect password');
        cy.get('#login-user').click();
        cy.contains('Invalid email or password');
    })
    it('Displays error if invalid email and password', function() {
        cy.visit('/Login');
        cy.contains('Email').type('not_alex_peebles@outlook.com');
        cy.contains('Password').type('Incorrect password');
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
        cy.contains('Email').type('alex_peebles@outlook.com');
        cy.contains('Password').type('***REMOVED***');
        cy.get('#login-user').click();
        cy.url().should('include','/');
        cy.get('#logout-button').click();
        cy.get('#login-button');
        cy.get('#signup-button');

    })

})