import { expect } from 'chai'
import { shallowMount, RouterLinkStub } from '@vue/test-utils'
import Nav from '@/components/partials/Nav.vue'
import { createPinia, setActivePinia } from 'pinia'
import { useTutorialsStore } from '@/stores/useTutorialsStore'

// useUserStore no longer touches localStorage - the Auth0 client holds the
// token in memory - so a fresh store is already logged out and the
// signup/login buttons (v-if="!isLoggedIn") render.

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
                    },
                    // The login and signup buttons pass the current path to
                    // Auth0 so it can return the user here afterwards.
                    $route: {
                        fullPath: '/'
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
