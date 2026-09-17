import { createRouter, createMemoryHistory } from 'vue-router'

// `router-link` resolves to the real vue-router component, so mounting anything
// that contains one needs a router installed - otherwise the link renders as an
// empty comment node and every id inside it disappears.
const routes = [
    { path: '/', name: 'Home', component: { template: '<div/>' } },
    { path: '/login', name: 'Login', component: { template: '<div/>' } },
    { path: '/signup', name: 'Signup', component: { template: '<div/>' } },
    { path: '/about', name: 'About', component: { template: '<div/>' } },
    { path: '/tutorials', name: 'Tutorials', component: { template: '<div/>' } },
    { path: '/tutorials/:id', name: 'TutorialSingle', component: { template: '<div/>' } },
    { path: '/play', name: 'Play', component: { template: '<div/>' } },
    { path: '/leaderboard', name: 'Leaderboard', component: { template: '<div/>' } }
]

export const createTestRouter = () => createRouter({
    history: createMemoryHistory(),
    routes
})
