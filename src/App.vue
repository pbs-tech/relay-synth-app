<template>
	<v-app class="background">
	<Nav/>
		<v-content>
			<router-view></router-view>
		</v-content>
	</v-app>
</template>

<script>

import Nav from '@/components/partials/Nav'


export default {
	name: 'App',
  	components: { Nav },
  	created: 
  	function(){
 		this.$http.interceptors.response.use(undefined, function(err) {
      		return new Promise(function (resolve, reject) {
        		if (err.status === 401 && err.config && !err.config.__isRetryRequest) {
          			this.$store.dispatch(logout);
        		}
        		throw err;
      		});
    	});
	  },
	  watch: {
		  $route(to, from) {
			  document.title = 'Relay Synth - ' +  `${to.meta.title}` || 'Relay Synth'
		  }
	  }
};
</script>
