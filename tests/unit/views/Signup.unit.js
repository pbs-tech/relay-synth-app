import { expect } from 'chai'
import { shallowMount } from '@vue/test-utils'
import Signup from '@/views/Signup.vue'

describe('Signup.vue', function() {
    let page;
	beforeEach( function() {
		page = shallowMount(Signup, {
            stubs: ['router-link', 'router-view']
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