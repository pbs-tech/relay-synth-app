<template>
    <div class="tutorial-card">
		<v-card variant="outlined" color="primary" min-width="240" height="250">
			<v-card-title class="text-h5 text-background"> 
				{{ tutorial.number }} {{ tutorial.name }} 
			</v-card-title>
			<v-divider/>
				<v-card-subtitle class="text-h6 text-background"> 
					Category: {{ tutorial.category }} <br/>
					Difficulty: {{ tutorial.difficulty }} <br/>
					Points: {{ tutorial.pointsAvailable }} <br/>
				</v-card-subtitle>
				<div class="d-flex pl-2 pb-4" v-if="isTutorialTitleComplete(tutorial.number)">
					<v-icon size="large" color="background">
						mdi-check-circle
					</v-icon>
					<v-card-subtitle class="text-h6 text-background">
						Completed
					</v-card-subtitle>
				</div>
		</v-card>
    </div>
</template>

<script>
import { computed } from 'vue'
import { useUserStore } from '@/stores/useUserStore'

export default {
	name: 'TutorialCard',
	props: {
		tutorial: Object
	},
	setup() {
		const userStore = useUserStore()

		const tutorialsCompleted = computed(() => userStore.tutorialsCompleted)

		return {
			tutorialsCompleted
		}
	},
	methods: {
        isTutorialTitleComplete(number) {
            if (this.tutorialsCompleted.includes(number)) {
                return true;
            } else {
                return false;
            }
		}
	}
}
</script>