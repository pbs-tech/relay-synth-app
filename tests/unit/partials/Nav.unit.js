import { expect } from 'chai'
import { shallowMount } from '@vue/test-utils'
import Nav from '@/components/partials/Nav.vue'
import { createPinia, setActivePinia } from 'pinia'
import { useUserStore } from '@/stores/useUserStore'
import { useTutorialsStore } from '@/stores/useTutorialsStore'

// Mock localStorage
const localStorageMock = {
    getItem: (key) => {
        switch(key) {
            case 'token': return 'mock-token'
            case 'userEmail': return 'test@example.com'
            case 'userScore': return '100'
            case 'tutorialsCompleted': return JSON.stringify([1, 2, 3, 4, 5])
            default: return null
        }
    },
    setItem: () => {},
    removeItem: () => {}
}
global.localStorage = localStorageMock

const createMockPinia = () => {
    const pinia = createPinia()
    setActivePinia(pinia)
    
    // Mock user store
    const userStore = useUserStore()
    userStore.token = 'mock-token'
    userStore.userEmail = 'test@example.com'
    userStore.userScore = 100
    userStore.tutorialsCompleted = [1, 2, 3, 4, 5]
    
    // Mock tutorials store  
    const tutorialsStore = useTutorialsStore()
    tutorialsStore.tutorialCount = { total: 10 }
    
    return pinia
}

describe('Nav.vue', () => {
	let component;

    beforeEach( function() {
		component = shallowMount(Nav, {
            global: {
                plugins: [createMockPinia()],
                stubs: ['router-link'],
                mocks: {
                    $router: {
                        push: () => {}
                    }
                }
            }
        });
    })
    it('renders buttons and title', function() {
        expect(component.find('#login-button').exists()).to.be.true;
        expect(component.find('#signup-button').exists()).to.be.true;
        expect(component.find('#drawer').exists()).to.be.true;
        expect(component.find('#site-title').exists()).to.be.true;
    })

    
})