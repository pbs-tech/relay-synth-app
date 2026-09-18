describe('Leaderboard', () => {
    beforeEach(function() {
        cy.loginByAuth0();
    })

    it('should allow logged in user to visit leaderboard page', function() {
        cy.visit('/leaderboard');
        cy.contains('Leaderboard');
        // The Email column is now Player, showing the API's displayName - the
        // leaderboard no longer returns anybody's email address.
        cy.contains('Player');
        cy.contains('Score');
        cy.contains('Rank');
        cy.contains('Tutorials Completed');
        cy.get('#search-field').type('a');
        cy.get('#search-field').clear();
    })

    it('does not expose email addresses', function() {
        cy.visit('/leaderboard');
        cy.contains('Leaderboard');
        // `cy.contains(x).should('not.exist')` would fail inside contains()
        // rather than assert; assert on the body's text instead.
        cy.get('body').should('not.contain', Cypress.env('userEmail'));
    })
})
