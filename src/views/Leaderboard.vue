<template>
    <v-container class="my-5">
		<h1 class="text-h2 text-secondary">Leaderboard</h1>
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
			// Two changes here. The Email column now reads `displayName`: the
			// API no longer returns email addresses, having previously
			// published every player's to anyone who could reach the endpoint.
			// And the keys are `title`/`key` rather than Vuetify 2's
			// `text`/`value` - Vuetify 3's v-data-table ignores the old pair,
			// so every column was rendering blank and pointing the old key at
			// `displayName` would have changed nothing on its own.
			headers: [
				{
					title: 'Rank',
					align: 'start',
					sortable: false,
					key: 'rank'
				},
				{ title: 'Player', key: 'displayName'},
				{ title: 'Total Score', key: 'totalScore'},
				{ title: 'Tutorials Completed', key: 'tutorialsCompleted.length'}
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