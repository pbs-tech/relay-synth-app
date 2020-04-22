<template>
  	<div class="home">
    	<v-container fluid class="ma-0 pa-0">
			<v-layout row wrap>
				<v-row no-gutters>
					<v-col fixed>
						<v-img id="home-image" aspect-ratio= "1" min-width="360" class="align-center" src='../assets/img/home.jpg'>
						<v-flex id="home-image-overlay" class="primary background--text display-3 text-center py-3">Relay Synth</v-flex></v-img>
					</v-col>
					<v-col>
						<v-row>
							<h1 id='home-title' class="display-3 pa-6 secondary--text">Home</h1>
						</v-row>
						<v-row justify="center" align="center">
							<v-container  id="home-text" class="pa-5 ma-auto">
								<v-row  justify="center" align="center" class="pa-5 ma-auto">
									<v-col cols="12" class="align-text-center">
										Welcome to Relay Synth, a fun and engaging interactive web app for teaching sound synthesis for music production.
										<br/><br/>
										Click a button below to begin. 
									</v-col>
									<v-container class="d-flex justify-end px-5">
										<router-link to="/tutorials">
											<v-btn id="tutorial-button" width="125" large class="ma-1 primary">tutorials</v-btn>
										</router-link>
										<router-link to="/play">
											<v-btn id="play-button" width="125" large class="ma-1 primary">play</v-btn>
										</router-link>
									</v-container>
								</v-row>
							</v-container>
						</v-row>
					</v-col>
				</v-row>
			</v-layout>
    	</v-container>
 	</div>
</template>
<script>

export default {
  name: 'home',
}
</script>
