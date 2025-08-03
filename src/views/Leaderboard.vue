<template>
    <v-container class="my-5">
		<h1 class="display-3 secondary--text">Leaderboard</h1>
		<v-text-field
			id="search-field"
			v-model="search"
			append-icon="mdi-magnify"
			label="Search"
			single-line
			hide-details>
		</v-text-field>
		<v-data-table
			:search="search"
			:headers="headers"
			:items= userScores
			:items-per-page="10">
      </v-data-table>
    </v-container>
</template>
<script>
import { computed } from 'vue'
import { useLeaderboardStore } from '@/stores/useLeaderboardStore'
import { useTutorialsStore } from '@/stores/useTutorialsStore'

export default {
	name: "leaderboard",
	setup() {
		const leaderboardStore = useLeaderboardStore()
		const tutorialsStore = useTutorialsStore()

		const userScores = computed(() => leaderboardStore.userScores)
		const tutorialCount = computed(() => tutorialsStore.tutorialCount)

		const fetchScores = () => {
			return leaderboardStore.fetchScores()
		}

		return {
			userScores,
			tutorialCount,
			fetchScores
		}
	},
	data() {
		return {
			search: '',
			headers: [
				{
					text: 'Rank',
					align: 'start',
					sortable: false,
					value: 'rank'
				},
				{ text: 'Email', value: 'email'},
				{ text: 'Total Score', value: 'totalScore'},
				{ text: 'Tutorials Completed', value: 'tutorialsCompleted.length'}
			],
		}
	},
	methods: {
		calculateRank(index) {
			return index++
		},
		test() {
			return 'test'
		}
	},
	created() {
		this.fetchScores();
	}
}
</script>