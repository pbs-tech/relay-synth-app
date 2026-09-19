import { defineStore } from 'pinia'
import http from '@/api/http'

export const useLeaderboardStore = defineStore('leaderboard', {
  state: () => ({
    userScores: []
  }),

  getters: {
    // userScores is already accessible as state
  },

  actions: {
    async fetchScores() {
      const response = await http.get('/leaderboard')
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