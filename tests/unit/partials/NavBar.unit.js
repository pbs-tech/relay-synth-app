import { expect } from 'chai'
import { shallowMount } from '@vue/test-utils'
import { createTestRouter } from '../helpers/router'
import NavBar from '@/components/partials/NavBar.vue'
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

const mountNav = ({ loggedIn }) => {
    const pinia = createPinia()
    setActivePinia(pinia)

    const userStore = useUserStore()
    userStore.token = loggedIn ? 'mock-token' : ''
    userStore.userEmail = 'test@example.com'
    userStore.userScore = 100
    userStore.tutorialsCompleted = [1, 2, 3, 4, 5]

    const tutorialsStore = useTutorialsStore()
    tutorialsStore.tutorialCount = { total: 10 }
    // NavBar fetches the count on mount; keep the suite off the network.
    tutorialsStore.fetchTutorialCount = () => Promise.resolve()

    return shallowMount(NavBar, {
        global: {
            plugins: [pinia, createTestRouter()]
        }
    })
}

describe('NavBar.vue', () => {
    it('renders the drawer toggle and site title', function() {
        const component = mountNav({ loggedIn: false })
        expect(component.find('#drawer').exists()).to.be.true;
        expect(component.find('#site-title').exists()).to.be.true;
    })

    it('renders signup and login buttons when logged out', function() {
        const component = mountNav({ loggedIn: false })
        expect(component.find('#signup-button').exists()).to.be.true;
        expect(component.find('#login-button').exists()).to.be.true;
        expect(component.find('#logout-button').exists()).to.be.false;
    })

    it('renders the logout button when logged in', function() {
        const component = mountNav({ loggedIn: true })
        expect(component.find('#logout-button').exists()).to.be.true;
        expect(component.find('#login-button').exists()).to.be.false;
        expect(component.find('#signup-button').exists()).to.be.false;
    })
})
