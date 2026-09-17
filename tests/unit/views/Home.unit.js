import { expect } from 'chai'
import { shallowMount } from '@vue/test-utils'
import { createTestRouter } from '../helpers/router'
import Home from '@/views/Home.vue'
import { createPinia } from 'pinia'
describe('Home.vue', function() {
	let page;

	beforeEach( function() {
		page = shallowMount(Home, {
            global: {
                plugins: [createPinia(), createTestRouter()],
                            }
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
