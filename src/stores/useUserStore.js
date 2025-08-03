import { defineStore } from 'pinia'
import axios from 'axios'

export const useUserStore = defineStore('user', {
  state: () => ({
    status: '',
    token: localStorage.getItem('token') || '',
    userEmail: localStorage.getItem('userEmail') || '',
    userScore: localStorage.getItem('userScore') || 0,
    tutorialsCompleted: JSON.parse(localStorage.getItem('tutorialsCompleted')) || [],
    tutorialComplete: false
  }),

  getters: {
    isLoggedIn: (state) => !!state.token,
    authStatus: (state) => state.status,
    tutorialsCompletedCount: (state) => state.tutorialsCompleted.length
  },

  actions: {
    login(user) {
      return new Promise((resolve, reject) => {
        this.status = 'loading'
        axios.post('https://api.relay-synth.tech/login', user)
          .then(response => {
            const token = response.data.token
            const user = response.data.user
            const userEmail = user.email
            const userScore = user.totalScore
            const tutorialsCompleted = user.tutorialsCompleted
            
            localStorage.setItem('token', token)
            localStorage.setItem('userEmail', userEmail)
            localStorage.setItem('userScore', userScore)
            localStorage.setItem('tutorialsCompleted', JSON.stringify(tutorialsCompleted))
            axios.defaults.headers.common['auth-token'] = token
            
            this.status = 'success'
            this.token = token
            this.userEmail = userEmail
            this.userScore = userScore
            this.tutorialsCompleted = tutorialsCompleted
            
            resolve(response)
          })
          .catch(err => {
            this.status = 'error'
            localStorage.removeItem('token')
            localStorage.removeItem('userEmail')
            localStorage.removeItem('userScore')
            localStorage.removeItem('tutorialsCompleted')
            reject(err)
          })
      })
    },

    signup(user) {
      return new Promise((resolve, reject) => {
        this.status = 'loading'
        axios.post('https://api.relay-synth.tech/signup', user)
          .then(response => {
            const token = response.data.token
            const user = response.data.user
            const userEmail = user.email
            const userScore = user.totalScore
            const tutorialsCompleted = user.tutorialsCompleted
            
            localStorage.setItem('token', token)
            localStorage.setItem('userEmail', userEmail)
            localStorage.setItem('userScore', userScore)
            localStorage.setItem('tutorialsCompleted', JSON.stringify(tutorialsCompleted))
            axios.defaults.headers.common['auth-token'] = token
            
            this.status = 'success'
            this.token = token
            this.userEmail = userEmail
            this.userScore = userScore
            this.tutorialsCompleted = tutorialsCompleted
            
            resolve(response)
          })
          .catch(err => {
            this.status = 'error'
            localStorage.removeItem('token')
            localStorage.removeItem('userEmail')
            localStorage.removeItem('userScore')
            localStorage.removeItem('tutorialsCompleted')
            reject(err)
          })
      })
    },

    logout() {
      return new Promise((resolve) => {
        this.status = ''
        this.token = ''
        this.userEmail = ''
        this.userScore = 0
        this.tutorialsCompleted = []
        
        localStorage.removeItem('token')
        localStorage.removeItem('userEmail')
        localStorage.removeItem('userScore')
        localStorage.removeItem('tutorialsCompleted')
        delete axios.defaults.headers.common['auth-token']
        
        resolve()
      })
    },

    async updateScore(score) {
      const userEmail = localStorage.getItem('userEmail')
      const response = await axios.patch('https://api.relay-synth.tech/user/update/score', {
        email: userEmail,
        tutorialScore: score
      })
      const updatedScore = response.data.totalScore
      localStorage.setItem('userScore', updatedScore)
      this.userScore = updatedScore
    },

    async updateTutorialsCompleted(tutorialCompleteId) {
      const userEmail = localStorage.getItem('userEmail')
      this.status = 'loading'
      const response = await axios.patch('https://api.relay-synth.tech/user/update/tutorials', {
        email: userEmail,
        tutorialId: tutorialCompleteId
      })
      const tutorialsCompleted = response.data.tutorialsCompleted
      localStorage.setItem('tutorialsCompleted', JSON.stringify(tutorialsCompleted))
      this.tutorialsCompleted = tutorialsCompleted
      this.tutorialComplete = true
    },

    async isTutorialComplete(tutorialId) {
      for (let i = 0; i < this.tutorialsCompleted.length; i++) {
        if (this.tutorialsCompleted[i] == tutorialId) {
          this.tutorialComplete = true
          return this.tutorialComplete
        }
      }
      this.tutorialComplete = false
      return this.tutorialComplete
    },

    setTutorialComplete(completed) {
      this.tutorialComplete = completed
    }
  }
})