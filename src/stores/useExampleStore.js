import { defineStore } from 'pinia'
import http from '@/api/http'

export const useExampleStore = defineStore('example', {
  state: () => ({
    example: ''
  }),

  getters: {
    // example is already accessible as state
  },

  actions: {
    async fetchExample(tutorialId) {
      const response = await http.get('/tutorials/' + tutorialId + '/example')
      this.example = response.data.example
    }
  }
})