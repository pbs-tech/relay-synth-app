import { defineStore } from 'pinia'
import axios from 'axios'

export const useExampleStore = defineStore('example', {
  state: () => ({
    example: ''
  }),

  actions: {
    async fetchExample(tutorialId) {
      const response = await axios.get('https://api.relay-synth.tech/tutorials/' + tutorialId + '/example')
      this.example = response.data.example
    }
  }
})