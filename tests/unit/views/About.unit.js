import { expect } from 'chai'
import { shallowMount } from '@vue/test-utils'
import About from '@/views/About.vue'
describe('About.vue', () => {
	let page;

	beforeEach( function() {
		page = shallowMount(About);
	})
	it('renders page title', function() {
		expect(page.find('#about-title').exists()).to.be.true;
		

	})
	it('renders headings', function() {
		expect(page.find('#problem-heading').exists()).to.be.true;
		expect(page.find('#solution-heading').exists()).to.be.true;
		expect(page.find('#features-heading').exists()).to.be.true;

	})
	it('renders subheadings', function() {
		expect(page.find('#technologies-heading').exists()).to.be.true;
		expect(page.find('#frontend-subheading').exists()).to.be.true;
		expect(page.find('#backend-subheading').exists()).to.be.true;

	})
	it('renders paragraphs', function() {
		expect(page.find('#problem-text').exists()).to.be.true;
		expect(page.find('#solution-text').exists()).to.be.true;
	})
	it('renders lists', function() {
		expect(page.find('#features-list').exists()).to.be.true;
		expect(page.find('#backend-list').exists()).to.be.true;
		expect(page.find('#frontend-list').exists()).to.be.true;
	})
})
