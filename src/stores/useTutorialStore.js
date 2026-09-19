import { defineStore } from 'pinia'
import http from '@/api/http'

export const useTutorialStore = defineStore('tutorial', {
  state: () => ({
    data: {
      number: '',
      title: '',
      difficulty: '',
      category: '',
      pointsAvailable: '',
      text: ''
    },
    completed: undefined
  }),

  getters: {
    tutorial: (state) => state.data,
    pointsAvailable: (state) => state.data.pointsAvailable,
    category: (state) => state.data.category,
    text: (state) => state.data.text,
    title: (state) => state.data.title,
    difficulty: (state) => state.data.difficulty,
    number: (state) => state.data.number
  },

  actions: {
    async fetchTutorialText(tutorialId) {
      const response = await http.get('/tutorials/' + tutorialId + '/text')
      this.data = response.data
    }
  }
})