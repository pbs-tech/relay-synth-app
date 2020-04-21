
const getStore = () => cy.window().its('app.$store');
describe('Tutorials', function() {

    beforeEach(function() {
        cy.visit('/');
        it('loads', () => {
            cy.window()
            .its('app')
        })  
        getStore().then((store) => {
            store.dispatch('login', { email: 'alex_peebles@outlook.com',
            password: '***REMOVED***'});
        })
        getStore().its('getters.isLoggedIn').should('eq', true);

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