<template>
	<v-app class="bg-background">
	<SiteNav/>
		<v-main>
			<router-view></router-view>
		</v-main>
		<!--
			Browsers that block autoplay outright - the privacy-hardened Firefox
			forks do by default - refuse to resume the AudioContext on a gesture
			alone and need a per-site permission. Nothing used to say so, which
			made a correctly working synth look broken.
		-->
		<v-snackbar
			v-model="audioBlocked"
			:timeout="-1"
			color="warning"
			location="top">
			<span class="text-body-2">
				This browser is blocking audio for the site. Allow autoplay of
				audio for it, then press Enable audio.
			</span>
			<template v-slot:actions>
				<v-btn variant="text" @click="enableAudio"> Enable audio </v-btn>
			</template>
		</v-snackbar>
	</v-app>
</template>

<script>

import SiteNav from '@/components/partials/Nav'
import http from '@/api/http'
import { useUserStore } from '@/stores/useUserStore'
import { onAudioBlockedChange, unlockAudio } from '@/util/audioContext'


export default {
	name: 'App',
	components: { SiteNav },
	data() {
		return {
			audioBlocked: false
		}
	},
	mounted() {
		this.unsubscribeAudioBlocked = onAudioBlockedChange(blocked => {
			this.audioBlocked = blocked
		})
	},
	unmounted() {
		if (this.unsubscribeAudioBlocked) {
			this.unsubscribeAudioBlocked()
			this.unsubscribeAudioBlocked = null
		}
	},
	methods: {
		// A click on a real button is the strongest activation a page can get,
		// and by the time anyone presses this they have granted the permission
		// the browser was waiting for.
		enableAudio() {
			unlockAudio()
		}
	},
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
