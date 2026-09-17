// Credentials come from cypress.env.json (git-ignored) or CYPRESS_* env vars.
// See cypress.env.example.json.
const testEmail = Cypress.env('testEmail');
const testPassword = Cypress.env('testPassword');

const getStore = (storeName) => cy.window().then((win) => {
    const pinia = win.app.config.globalProperties.$pinia;
    return pinia._s.get(storeName);
});
describe('Leaderboard', () => {

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
    it('should allow logged in user to visit leaderboard page', function() {
        cy.visit('/leaderboard');
        cy.contains('Leaderboard');
        cy.contains('Email');
        cy.contains('Score');
        cy.contains('Rank');
        cy.contains('Tutorials Completed');
        cy.contains(testEmail);
        cy.get('.v-data-footer__icons-after').click();
        cy.get('#search-field').type(testEmail);
        cy.get('#search-field').clear();
        cy.get('.v-data-footer__icons-after').click();
        cy.get('.v-data-footer__icons-before').click();

   

    })



})