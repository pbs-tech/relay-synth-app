import { defineStore } from 'pinia'
import http from '@/api/http'

export const useTutorialsStore = defineStore('tutorials', {
  state: () => ({
    tutorialText: {},
    tutorialTitles: [],
    tutorialCount: 0
  }),

  getters: {
    // Convert state properties to getters for compatibility
  },

  actions: {
    async fetchTitles() {
      const response = await http.get('/tutorials/titles')
      this.tutorialTitles = response.data
    },

    async fetchTutorialCount() {
      const response = await http.get('/tutorials/count')
      this.tutorialCount = response.data
    },

    setTutorialText(tutorialText) {
      this.tutorialText = tutorialText
    },

    setPointsAvailable(pointsAvailable) {
      this.pointsAvailable = pointsAvailable
    }
  }
})