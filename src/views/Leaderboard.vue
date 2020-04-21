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
import { mapGetters, mapActions } from "vuex";
export default {
	name: "leaderboard",
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
		...mapActions(["fetchScores"]),
		calculateRank(index) {
			return index++
		},
		test() {
			return 'test'
		}
	},
	computed: 
	mapGetters(["userScores", "tutorialCount"]),
	created() {
		this.fetchScores();
	}
}
</script>