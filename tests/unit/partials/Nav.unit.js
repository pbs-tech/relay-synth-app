import { expect } from 'chai'
import { shallowMount, RouterLinkStub } from '@vue/test-utils'
import Nav from '@/components/partials/Nav.vue'
import { createPinia, setActivePinia } from 'pinia'
import { useTutorialsStore } from '@/stores/useTutorialsStore'

// useUserStore seeds its state from localStorage, so the mock has to report a
// logged-out user for the signup/login buttons (v-if="!isLoggedIn") to render.
const localStorageMock = {
    getItem: () => null,
    setItem: () => {},
    removeItem: () => {}
}
global.localStorage = localStorageMock

const createMockPinia = () => {
    const pinia = createPinia()
    setActivePinia(pinia)

    // Nav calls this on mount; stub it so the suite makes no network request.
    const tutorialsStore = useTutorialsStore()
    tutorialsStore.fetchTutorialCount = () => Promise.resolve()
    tutorialsStore.tutorialCount = { total: 10 }

    return pinia
}

describe('Nav.vue', () => {
	let component;

    beforeEach( function() {
		component = shallowMount(Nav, {
            global: {
                plugins: [createMockPinia()],
                components: { 'router-link': RouterLinkStub },
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
