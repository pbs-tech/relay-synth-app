<template>
	<v-app class="bg-background">
	<SiteNav/>
		<v-main>
			<router-view></router-view>
		</v-main>
	</v-app>
</template>

<script>

import SiteNav from '@/components/partials/Nav'
import http from '@/api/http'
import { useUserStore } from '@/stores/useUserStore'


export default {
	name: 'App',
	components: { SiteNav },
	created:
	function(){
		// Was `this.$store.dispatch(logout)`: Vuex no longer exists and `logout`
		// was an undefined variable, so this handler threw instead of logging
		// the user out. Axios also reports the status on err.response.
		const userStore = useUserStore()
		http.interceptors.response.use(undefined, function(err) {
			if (err.response && err.response.status === 401) {
				// Clear local state only. A full Auth0 logout here would redirect
				// the browser away mid-request; the token has simply expired and
				// the next login can reuse the Auth0 session.
				userStore.reset()
			}
			return Promise.reject(err)
		});

		// Kick off session restoration so the nav settles without waiting for a
		// guarded navigation. The router guard awaits the same memoised promise.
		userStore.restoreSession()
	},
	watch: {
		$route(to) {
			document.title = 'Relay Synth - ' +  `${to.meta.title}` || 'Relay Synth'
		}
	}
};
</script>
