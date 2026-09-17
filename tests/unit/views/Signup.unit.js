import { expect } from 'chai'
import { shallowMount } from '@vue/test-utils'
import { createTestRouter } from '../helpers/router'
import Signup from '@/views/Signup.vue'
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
    userStore.signup = () => Promise.resolve()
    
    return pinia
}

describe('Signup.vue', function() {
    let page;
	beforeEach( function() {
		page = shallowMount(Signup, {
            global: {
                plugins: [createMockPinia(), createTestRouter()],
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
        expect(page.find('#signup-title').exists()).to.be.true;
    })
    it('renders input fields', function() {
        expect(page.find('#signup-email-field').exists()).to.be.true;
        expect(page.find('#signup-password-field').exists()).to.be.true;
        expect(page.find('#signup-repeat-password-field').exists()).to.be.true;

    })
    it('renders buttons', function() {
        expect(page.find('#login-redirect-text').exists()).to.be.true;
        expect(page.find('#login-redirect').exists()).to.be.true;
        expect(page.find('#signup-user').exists()).to.be.true;

    })

})