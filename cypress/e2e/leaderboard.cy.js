describe('Leaderboard', () => {
    beforeEach(function() {
        cy.loginByStore();
    })

    it('should allow logged in user to visit leaderboard page', function() {
        cy.visit('/leaderboard');
        cy.contains('Leaderboard');
        cy.contains('Email');
        cy.contains('Score');
        cy.contains('Rank');
        cy.contains('Tutorials Completed');
        cy.contains(Cypress.env('userEmail'));
        cy.get('#search-field').type(Cypress.env('userEmail'));
        cy.get('#search-field').clear();
    })
})
