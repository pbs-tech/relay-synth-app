import { expect } from 'chai'
import { shallowMount } from '@vue/test-utils'
import Login from '@/views/Login.vue'
import { createPinia, setActivePinia } from 'pinia'
import { useUserStore } from '@/stores/useUserStore'

// Mock localStorage
global.localStorage = {
    getItem: () => null,
    setItem: () => {},
    removeItem: () => {}
}

const createMockPinia = () => {
    const pinia = createPinia()
    setActivePinia(pinia)
    
    // Mock user store actions
    const userStore = useUserStore()
    userStore.login = () => Promise.resolve()
    
    return pinia
}

describe('Login.vue', function() {
    let page;
	beforeEach( function() {
		page = shallowMount(Login, {
            global: {
                plugins: [createMockPinia()],
                stubs: ['router-link', 'router-view'],
                mocks: {
                    $router: {
                        push: () => {},
                        go: () => {}
                    }
                }
            }
        });
    })
    it('renders title', function() {
        expect(page.find('#login-title').exists()).to.be.true;
    })
    it('renders input fields', function() {
        expect(page.find('#login-email-field').exists()).to.be.true;
        expect(page.find('#login-password-field').exists()).to.be.true;
    })
    it('renders buttons', function() {
        expect(page.find('#signup-redirect-text').exists()).to.be.true;
        expect(page.find('#signup-redirect').exists()).to.be.true;
        expect(page.find('#login-user').exists()).to.be.true;

    })

})