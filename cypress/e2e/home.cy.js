describe('/', function() {
    beforeEach(function() {
        cy.visit('/');
    })

    it('Loads text', function() {
        cy.contains('Home');
        // Copy assertions match src/views/Home.vue; they previously asserted an
        // older wording ("Welcome to relay-synth.com", "Click below to begin").
        cy.contains('Welcome to Relay Synth, a fun and engaging interactive web app for teaching sound synthesis for music production.');
        cy.contains('Relay Synth');
        cy.contains('Click a button below to begin.');
    })
    it('Nav drawer toggle', function() {
        cy.get('#drawer').click();
        cy.get('#drawer-close').click();
    })
    it('Loads buttons', function() {
        cy.get('#login-button').should('exist');
        cy.get('#signup-button').should('exist');
        cy.get('#tutorial-button').should('exist');
    })
    it('Loads large image', function() {
        cy.get('#home-image').should('be.visible');
        cy.get('#home-image-overlay').should('be.visible');
    })
})
