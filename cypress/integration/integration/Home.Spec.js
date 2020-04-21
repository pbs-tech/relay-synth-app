describe('/', function() {
    it('Loads text', function() {
        cy.visit('/');
        cy.contains('Home');
        cy.contains('Welcome to relay-synth.com, a fun and engaging interactive web app for teaching sound synthesis for music production.')
        cy.contains('Relay Synth');
        cy.contains('Click below to begin');
    })
    it('Nav drawer toggle', function() {
        cy.get('#drawer').click();
        cy.get('#drawer-close').click();
    })
    it('Loads buttons', function() {
        cy.contains('Login');
        cy.contains('Signup');
        cy.contains('Tutorials');
    })
    it('Loads large image', function() {
        cy.get('#home-image').should('be.visible');
        cy.get('#home-image-overlay').should('be.visible');

    })
})