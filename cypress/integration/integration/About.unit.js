describe("/about",function() {
    it('Page loads', function() {
        cy.visit('/about');
        cy.contains('About');
        cy.contains('The Problem');
        cy.contains('My Solution');
        cy.contains('Features');
        cy.contains('Technologies Used');
    })
})