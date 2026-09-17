// Credentials come from cypress.env.json (git-ignored) or CYPRESS_* env vars.
// See cypress.env.example.json.
const testEmail = Cypress.env('testEmail');
const testPassword = Cypress.env('testPassword');

const getStore = (storeName) => cy.window().then((win) => {
    const pinia = win.app.config.globalProperties.$pinia;
    return pinia._s.get(storeName);
});
describe('Tutorials', function() {

    beforeEach(function() {
        cy.visit('/');
        it('loads', () => {
            cy.window()
            .its('app')
        })  
        getStore('user').then((store) => {
            store.login({ email: testEmail, password: testPassword });
        })
        getStore('user').its('isLoggedIn').should('eq', true);

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