import { defineStore } from 'pinia'
import axios from 'axios'

export const useTutorialsStore = defineStore('tutorials', {
  state: () => ({
    tutorialText: {},
    tutorialTitles: [],
    tutorialCount: 0
  }),

  actions: {
    async fetchTitles() {
      const response = await axios.get('https://api.relay-synth.tech/tutorials/titles')
      this.tutorialTitles = response.data
    },

    async fetchTutorialCount() {
      const response = await axios.get('https://api.relay-synth.tech/tutorials/count')
      this.tutorialCount = response.data
    },

    setTutorialText(tutorialText) {
      this.tutorialText = tutorialText
    }
  }
})