let user;
let token;
const getPiniaStore = (storeName) => cy.window().then((win) => {
    const pinia = win.app.config.globalProperties.$pinia;
    return pinia._s.get(storeName);
});

describe('JWT', () => {
    before(function fetchUser() {
        cy.request('POST', 'https://localhost:8000/login', {
            email: "alex_peebles@outlook.com",
            password: "***REMOVED***"
        }).its('body')
        .as('currentUser')
        .then((res) => {
            user = res.user;
            cy.log(res.user);   
            token = res.token; 
        })
    })

    beforeEach(function setUser() {
        cy.visit('/', {
            onBeforeLoad(win) {
                win.localStorage.setItem('user', JSON.stringify(user));
                win.localStorage.setItem('auth-token', token);
            }
        })
        it('loads', () => {
            cy.window()
            .its('app')
        })
    })
    it('makes authenticated request', function() {
       cy.request({
            method: 'GET',
            url: 'https://localhost:8000/user/profile',
            body: {
                email: user.email
            },
            headers: {
                "auth-token": token
            }
        })
        .its('body')
        .should('include',  {
            email: 'alex_peebles@outlook.com'
        })
    }) 
    it('Allows user onto routes requiring authentication', function() {
        cy.log(token);
        getPiniaStore('user').then((userStore) => {
            userStore.login({ email: 'alex_peebles@outlook.com', password: '***REMOVED***' });
        })
        getPiniaStore('user').then((userStore) => {
            expect(userStore.isLoggedIn).to.be.true;
        });
        cy.visit('/tutorials');
        
   })
}) 