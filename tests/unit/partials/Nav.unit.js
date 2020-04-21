import { expect } from 'chai'
import { shallowMount } from '@vue/test-utils'
import Nav from '@/components/partials/Nav.vue'


describe('Nav.vue', () => {
	let component;

    beforeEach( function() {
		component = shallowMount(Nav, {
            stubs: ['router-link']
        });
    })
    it('renders buttons and title', function() {
        expect(component.find('#login-button').exists()).to.be.true;
        expect(component.find('#signup-button').exists()).to.be.true;
        expect(component.find('#drawer').exists()).to.be.true;
        expect(component.find('#site-title').exists()).to.be.true;
    })

    
})