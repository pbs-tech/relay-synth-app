<template>
	<v-app class="background">
	<SiteNav/>
		<v-main>
			<router-view></router-view>
		</v-main>
	</v-app>
</template>

<script>

import SiteNav from '@/components/partials/Nav'
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
		this.$http.interceptors.response.use(undefined, function(err) {
			if (err.response && err.response.status === 401) {
				userStore.logout()
			}
			return Promise.reject(err)
		});
	  },
	  watch: {
		  $route(to, from) {
			  document.title = 'Relay Synth - ' +  `${to.meta.title}` || 'Relay Synth'
		  }
	  }
};
</script>
