<template>
	<v-app class="bg-background">
	<NavBar/>
		<v-main>
			<router-view></router-view>
		</v-main>
	</v-app>
</template>

<script>

import NavBar from '@/components/partials/NavBar'
import { useUserStore } from '@/stores/useUserStore'


export default {
	name: 'App',
	components: { NavBar },
	setup() {
		const userStore = useUserStore()
		return { userStore }
	},
	created() {
		this.$http.interceptors.response.use(undefined, (err) => {
			// axios reports the status on err.response, not on err itself.
			if (err.response && err.response.status === 401 && err.config && !err.config.__isRetryRequest) {
				this.userStore.logout().then(() => {
					if (this.$route.path !== '/login') {
						this.$router.push('/login')
					}
				})
			}
			return Promise.reject(err)
		})
	},
	watch: {
		$route(to) {
			document.title = to.meta.title ? 'Relay Synth - ' + to.meta.title : 'Relay Synth'
		}
	}
};
</script>
