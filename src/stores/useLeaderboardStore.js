import { defineStore } from 'pinia'
import axios from 'axios'

export const useLeaderboardStore = defineStore('leaderboard', {
  state: () => ({
    userScores: []
  }),

  getters: {
    // userScores is already accessible as state
  },

  actions: {
    async fetchScores() {
      const response = await axios.get('https://api.relay-synth.tech/leaderboard')
      this.userScores = response.data.users
      this.setRanks()
    },

    setRanks() {
      for (let i = 0; i < this.userScores.length; i++) {
        this.userScores[i].rank = i + 1
      }
    }
  }
})