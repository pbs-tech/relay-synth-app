import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '../stores/useUserStore'
import { isAuth0Configured } from '../auth/config'

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
		// Where Auth0 returns the browser after Universal Login. Must match the
		// application's Allowed Callback URLs.
		path: '/callback',
		name: 'Callback',
		component: () => import(/* webpackChunkName: "callback" */ '../views/Callback.vue'),
		meta: {
			title: 'Signing in'
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
		// The view existed but was never routed, so nothing could reach it.
		// The guard sends here when Auth0 is not configured.
		path: '/401',
		name: '401',
		component: () => import(/* webpackChunkName: "401" */ '../views/error/401.vue'),
		meta: {
			title: 'Unauthorised'
		}
	},
    {
		path: '/:pathMatch(.*)*',
		name: '404',
		component: () => import(/* webpackChunkName: "404" */ '../views/error/404.vue'),
		meta: {
			title: 'Page not found'
		}
	}
  ]

  const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes,
  })

  // The guard is async because the Auth0 client restores the session
  // asynchronously. The old synchronous check read a token that had already
  // been rehydrated from localStorage; there is no such token now, so a guarded
  // route loaded cold would always have bounced to login before the SDK
  // answered. `restoreSession` memoises its work, so this costs one await.
  router.beforeEach(async (to) => {
    // The callback route is what establishes the session, so it cannot require
    // one - guarding it would loop.
    if (to.name === 'Callback') {
      return true
    }

    if (!to.matched.some(record => record.meta.requiresAuth)) {
      return true
    }

    const userStore = useUserStore()
    await userStore.restoreSession()

    if (userStore.isLoggedIn) {
      return true
    }

    if (!isAuth0Configured()) {
      // No tenant configured: send them somewhere that explains, rather than
      // to a login that cannot work.
      return { name: '401' }
    }

    // Universal Login is a full page redirect, so cancel this navigation and
    // let the browser leave. `targetPath` brings them back here afterwards.
    await userStore.loginWithRedirect(to.fullPath)
    return false
})

export default router
