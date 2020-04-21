import { expect } from 'chai'
import { shallowMount } from '@vue/test-utils'
import Home from '@/views/Home.vue'
describe('Home.vue', function() {
	let page;

	beforeEach( function() {
		page = shallowMount(Home, {
            stubs: ['router-link', 'router-view']
        });
	})
	it('renders page title', function() {
		expect(page.find('#home-title').exists()).to.be.true;
	})
	it('renders text', function() {
        expect(page.find('#home-text').exists()).to.be.true;
	})
	it('renders image', function() {
		expect(page.find('#home-image').exists()).to.be.true;
		expect(page.find('#home-image-overlay').exists()).to.be.true;
	})
	it('renders buttons', function() {
		expect(page.find('#tutorial-button').exists()).to.be.true;
	})
})
