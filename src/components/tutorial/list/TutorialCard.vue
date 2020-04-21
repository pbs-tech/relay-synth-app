<template>
    <div class="tutorial-card">
		<v-card  outline color="primary" min-width="240" height="250">
			<v-card-title class="headline background--text"> 
				{{ tutorial.number }} {{ tutorial.name }} 
			</v-card-title>
			<v-divider/>
				<v-card-subtitle class="title background--text"> 
					Category: {{ tutorial.category }} <br/>
					Difficulty: {{ tutorial.difficulty }} <br/>
					Points: {{ tutorial.pointsAvailable }} <br/>
				</v-card-subtitle>
				<div class="d-flex pl-2 pb-4" v-if="isTutorialTitleComplete(tutorial.number)">
					<v-icon large dark color="background">
						mdi-check-circle
					</v-icon>
					<v-card-subtitle class="title background--text">
						Completed
					</v-card-subtitle>
				</div>
		</v-card>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';


export default {
	name: 'TutorialCard',
	props: {
		tutorial: Object
	},
	methods: {
        isTutorialTitleComplete(number) {
            if (this.tutorialsCompleted.includes(number)) {
                return true;
            } else {
                return false;
            }
		}
	},
	computed: mapGetters(['tutorialsCompleted'])
}
</script>