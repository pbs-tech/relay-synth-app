describe('Tutorials', function() {
    beforeEach(function() {
        cy.loginByStore();
    })

    it('should allow logged in user to visit tutorials page', function() {
        cy.visit('/tutorials');
        cy.contains('Tutorials');
        cy.contains('Interactive tutorials to help you learn');
    })
    it('should allow user to click on a tutorial to open it', function() {
        cy.visit('/tutorials');
        cy.get('#1').click();
        cy.url().should('include','/tutorials/1');
    })
})
