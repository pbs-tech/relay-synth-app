import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '../store'

Vue.use(VueRouter)

const routes = [
    {
		path: '/',
		name: 'Home',
		component: () => import(/* webpackChunkName: "home" */ '../views/Home.vue'),
		meta: {
			title: 'Home'
		}
    },
    {
		path: '/login',
		name: 'Login',
		component: () => import(/* webpackChunkName: "login" */ '../views/Login.vue'),
		meta: {
			title: 'Login'
		}
	},
    {
		path: '/signup',
		name: 'Signup',
		component: () => import(/* webpackChunkName: "signup" */'../views/Signup.vue'),
		meta: {
			title: 'Signup'
		}
	},
    {
		path: '/about',
		name: 'About',
		// route level code-splitting
		// this generates a separate chunk (about.[hash].js) for this route
		// which is lazy-loaded when the route is visited.
		component: () => import(/* webpackChunkName: "about" */ '../views/About.vue'),
		meta: {
			title: 'About'
		}
	},
    {
		path: '/tutorials',
		name: 'Tutorials',
		component: () => import(/* webpackChunkName: "tutorials" */ '../views/Tutorials.vue'),
		meta: {
			requiresAuth: true,
			title: 'Tutorials'
		},
    },
    {
		path: '/tutorials/:id',
		name: 'TutorialSingle',
		component: () => import(/* webpackChunkName: "tutorialSingle" */ '../views/TutorialSingle.vue'),
		meta: {
			requiresAuth: true,
			title: 'Tutorial'

		},
    },
    {
		path: '/play',
		name: 'Play',
		component: () => import(/* webpackChunkName: "play" */ '../views/Play.vue'),
    },
    {
		path: '/leaderboard',
		name: 'Leaderboard',
		component: () => import(/* webpackChunkName: "leaderboard" */ '../views/Leaderboard.vue'),
		meta: {
			requiresAuth: true,
			title: 'Leaderboard'
		},
    },
    {
		path: '*',
		name: '404',
		component: () => import(/* webpackChunkName: "404" */ '../views/error/404.vue'),
		meta: {
			title: 'Page not found'
		}
	}
  ]

  const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes,

  })

  router.beforeEach((to, from, next) =>  {
    if (to.matched.some(record => record.meta.requiresAuth)) {
      if (store.getters.isLoggedIn) {
        next();
        return;
      }
      next('/login');
    } else {
      next();
    }
})

export default router
