import { defineStore } from 'pinia'
import { markRaw } from 'vue'
import axios from 'axios'
import * as Tone from 'tone'
import synthTypes from '../util/SynthTypes'

export const useSynthsStore = defineStore('synths', {
  state: () => ({
    polyphony: 1,
    synthType: null,
    tutorialSynth: null,
    userSynth: null,
    DEFAULT_VOLUME: -20,
    envRequired: false,
    filterRequired: false,
    filterEnvRequired: false,
    oscRequired: false,
    matching: undefined,
    userParams: '',
    tutorialParams: '',
    noOfGuesses: 0,
    showAnswer: false
  }),

  actions: {
    async fetchTutorialSynthData(tutorialId) {
      const response = await axios.get('https://api.relay-synth.tech/tutorials/' + tutorialId + '/synth')
      this.setRequirements(response.data.parameters)
      this.setTutorialSynth(response.data)
    },

    async fetchSynthBase(tutorialId) {
      const response = await axios.get('https://api.relay-synth.tech/tutorials/' + tutorialId + '/synth/settings')
      this.setSynthBase(response.data)
    },

    async checkAnswer() {
      const userParts = []
      const tutorialParts = []

      const compare = (key) => {
        userParts.push(JSON.stringify(this.userSynth.get()[key]))
        tutorialParts.push(JSON.stringify(this.tutorialSynth.get()[key]))
      }

      if (this.oscRequired) {
        userParts.push(JSON.stringify(this.userSynth.get().oscillator.type))
        tutorialParts.push(JSON.stringify(this.tutorialSynth.get().oscillator.type))
      }
      if (this.envRequired) {
        compare('envelope')
      }
      if (this.filterRequired) {
        compare('filter')
      }
      if (this.filterEnvRequired) {
        compare('filterEnvelope')
      }

      this.userParams = userParts.join('')
      this.tutorialParams = tutorialParts.join('')
      this.setMatching(this.userParams === this.tutorialParams)
    },

    setSynthBase(synthData) {
      this.polyphony = synthData.polyphony
      // Tone voice classes are constructors, never reactive data.
      this.synthType = markRaw(synthTypes.get(synthData.type))
    },

    setUserSynth() {
      // Tone v14 dropped the voice-count argument: new PolySynth(voice, options).
      const synth = new Tone.PolySynth(Tone.MonoSynth).toDestination()
      synth.volume.value = this.DEFAULT_VOLUME
      this.userSynth = markRaw(synth)
    },

    setTutorialSynth(tutorialSynthData) {
      const synth = new Tone.PolySynth(Tone.MonoSynth, tutorialSynthData.parameters).toDestination()
      synth.volume.value = this.DEFAULT_VOLUME
      this.tutorialSynth = markRaw(synth)
    },

    setRequirements(parameters) {
      this.oscRequired = Object.prototype.hasOwnProperty.call(parameters, 'oscillator')
      this.envRequired = Object.prototype.hasOwnProperty.call(parameters, 'envelope')
      this.filterRequired = Object.prototype.hasOwnProperty.call(parameters, 'filter')
      this.filterEnvRequired = Object.prototype.hasOwnProperty.call(parameters, 'filterEnvelope')
    },

    setMatching(matching) {
      this.matching = matching
      if (matching === false) {
        this.noOfGuesses += 1
      }
    },

    resetTutorial() {
      this.matching = undefined
      this.userParams = ''
      this.tutorialParams = ''
      this.showAnswer = false
      this.noOfGuesses = 0
    },

    resetTutorialParams() {
      this.tutorialParams = ''
    },

    setShowAnswer(showAnswer) {
      this.showAnswer = showAnswer
    }
  }
})
