<template>
	<v-container class="my-5">
		<h1 id="about-title" class="display-3 py-3 text--text">About</h1>
		<h2 id="problem-heading" class="headline text--text"> The Problem </h2>
		<p id="problem-text" class="text-justify body-1">
			A synthesizer is a musical instrument (either hardware 
			or software) that typically uses a piano keyboard to 
			generate audio signals to create sounds. Synthesizer
			user interfaces can be confusing for novice users with 
			lots of settings, knobs and technical details which vary 
			between model or program. Presets can be used to load 
			pre-saved sounds however this removes the skill of learning 
			and understanding how to manipulate synthesizers to create 
			unique sounds. 
		</p>
		<h2 id="solution-heading" class="headline text--text"> My Solution </h2>
		<p id="solution-text" class="text-justify body-1 ">
			Electronic learning (e-learning) is being increasingly
			applied to formal and informal music teaching and
			learning. I have created an interactive web application 
			which utilises e-learning and gamification to teach 
			elements of sound synthesis. This will allow aspiring 
			music producers to learn, understand and apply their 
			knowledge in a fun, interesting and engaging way with 
			the benefits of aninteractive, accessible and usable web 
			interface. 
		</p>
		<h2 id="features-heading" class="headline text--text"> Features </h2>
		<v-list id="features-list">
			<v-list-item class="text-justify body-1">
				Interactive tutorials with gamification elements
				to help teach  sound synthesis concepts.
			</v-list-item>
			<v-list-item class="text-justify body-1">
				Users can play a synthesizer in their browser, changing
				its sound to match the example and gain points.
			</v-list-item>
			<v-list-item class="text-justify body-1">
				Simple and responsive user-interface based on
				material design.
			</v-list-item>
			<v-list-item class="text-justify body-1">
				Dynamic leaderboard of usernames and their scores to 
				encourage competition.
			</v-list-item>
		</v-list>
		<h2 id="technologies-heading" class="headline text--text"> Technologies Used </h2>
		<h3 id="backend-subheading" class="title mx-auto pa-5 text--text"> Back-end </h3>
		<v-row class="ma-auto" id="backend-list" align="center" justify="center"> 
			<v-card class="background ma-auto" raised v-for="item in backEnd" :key="item.name" height="200px" width="200px">
				<a :href="item.link">
					<v-img class="ma-auto" v-if="item.img" height="100px" width="100px" :src="getImgUrl(item.img)"></v-img>
					<v-sheet v-else color="background" height="100px" width="100px">
					</v-sheet>
					<v-card-title> {{ item.name }} </v-card-title>
					<v-card-subtitle> {{ item.desc }} </v-card-subtitle>
				</a>
			</v-card>
		</v-row>
		<h3 id="frontend-subheading" class="title pa-5 text--text"> Front-end </h3>
		<v-row class="ma-auto" id="frontend-list" align="center" justify="center">
			<v-card class="background ma-auto"  raised v-for="item in frontEnd" :key="item.name" height="200px" width="200px">						
				<a :href="item.link">
					<v-img class="ma-auto" v-if="item.img" height="100px" max-width="100px" :src="getImgUrl(item.img)"> </v-img>
					<v-sheet v-else color="background" height="100px" width="100px"></v-sheet>
					<v-card-title> {{ item.name }} </v-card-title>
					<v-card-subtitle> {{ item.desc }} </v-card-subtitle>
				</a>
			</v-card>
		</v-row>
		<h2 id="references-subheading" class="py-5 headline text--text"> References </h2>
		<p class="text-justify text-align body-1">
			<strong> Synthesizer Image credit </strong> <br/>
			saragraphika (2020). Synthesizer. [online] Pixabay.com. Available at: https://cdn.pixabay.com/photo/2015/02/01/22/24/music-620360_1280.jpg [Accessed 22 Apr. 2020].
		</p>
		<p class="text-justify body-1">
			<strong> Aspects of tutorials adapted from </strong> <br/>
			Russ, M. (2002). Sound Synthesis and Sampling. Focal Press, pp.75–100. <br/>
			Robehmed, N. (2019). Sine, Square, Triangle, Saw : Synth Waveforms - Perfect Circuit. [online] www.perfectcircuit.com. Available at: https://www.perfectcircuit.com/signal/difference-between-waveforms [Accessed 13 Apr. 2020].
		</p>
    </v-container>
</template>

<script>
export default {
  	name: 'about',
	data() {
		return {
			backEnd: [
				{
					name: 	"Node.js",
					desc: 	"Runtime Environment",
					img: 	"node-js-brands.svg",
					link: 	"https://nodejs.org/en/"
				},

				{
					name: 	"MongoDB",
					desc: 	"Database Service",
					img: 	"MongoDB-leaf.svg",
					link: 	"https://www.mongodb.com/"
				},

				{
					name: 	"Express.js",
					desc: 	"Middleware and Routing",
					img:  	"expressjs-icon.svg",
					link: 	"https://expressjs.com/"
				},
				{
					name: 	"Passport.js",
					desc: 	"User Authentication",
					link: 	"http://www.passportjs.org/",
					img: 	"passport.svg"
				},
				{
					name: 	"Mongoose",
					desc: 	"Object Document Mapping",
					link: 	"https://mongoosejs.com/"
				},

			],
			frontEnd: [

				{
					name: 	"Vue.js",
					desc: 	"Front-end Framework",
					img: 	"vuejs-logo.svg",
					link: 	"https://vuejs.org/"
				},
				{
					name: 	"Vuetify",
					desc: 	"Material Design Components",
					img: 	"vuetify.svg",
					link: 	"https://vuetifyjs.com/en/"
				},
				{
					name: 	"Tone.js",
					desc: 	"Web Audio Framework",
					img: 	"tone-logo.png",
					link: 	"https://tonejs.github.io/"
				},
				{
					name: 	"Axios",
					desc: 	"HTTP Client",
					link: 	"https://github.com/axios/axios",
				},
				{
					name: 	"NexusUI",
					desc: 	"Web Audio UI Components",
					link: 	"https://nexus-js.github.io/ui/api/#intro"
				}
			]
	  	}
	},
	methods: {
		getImgUrl(pic) {
			if (pic === undefined) {
				return;
			}
			return require('../assets/img/'+pic);
		}
	}
}
</script>