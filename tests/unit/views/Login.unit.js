import { expect } from 'chai'
import { shallowMount } from '@vue/test-utils'
import Login from '@/views/Login.vue'

describe('Login.vue', function() {
    let page;
	beforeEach( function() {
		page = shallowMount(Login, {
            stubs: ['router-link', 'router-view']
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