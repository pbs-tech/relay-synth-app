import { defineStore } from 'pinia'
import axios from 'axios'
import * as Tone from 'tone'
import synthTypes from '../util/SynthTypes'

export const useSynthsStore = defineStore('synths', {
  state: () => ({
    polyphony: 1,
    synthType: '',
    tutorialSynth: null,
    userSynth: null,
    DEFAULT_VOLUME: -20,
    envRequired: false,
    filterRequired: false,
    filterEnvRequired: false,
    oscRequired: false,
    matching: undefined,
    userParams: {},
    tutorialParams: {},
    noOfGuesses: 0,
    showAnswer: false
  }),

  // These were Vuex getters that simply re-exported state. Vuex kept getters and
  // state in separate namespaces, so that was a harmless passthrough; Pinia puts
  // both on one object, where a getter of the same name shadows the state
  // property and makes it read-only - so every `this.userSynth = ...` in an
  // action threw and no synth was ever built. Pinia exposes state on the store
  // directly, so callers such as `synthsStore.userSynth` are unaffected.
  getters: {
    tutorialSynthData: (state) => state.tutorialSynthData,
    userSynthData: (state) => state.userSynthData
  },

  actions: {
    async fetchTutorialSynthData(tutorialId) {
      const response = await axios.get('https://api.relay-synth.tech/tutorials/' + tutorialId + '/synth')
      this.setRequirements(response.data.parameters)
      this.setTutorialSynth(response.data)
    },

    async fetchSynthBase(tutorialId) {
      console.log('fetching synth settings')
      const response = await axios.get('https://api.relay-synth.tech/tutorials/' + tutorialId + '/synth/settings')
      this.setSynthBase(response.data)
    },

    async checkAnswer() {
      if (this.oscRequired) {
        this.userParams = JSON.stringify(this.userSynth.get().oscillator.type)
        this.tutorialParams = JSON.stringify(this.tutorialSynth.get().oscillator.type)
      }
      if (this.envRequired) {
        this.userParams = this.userParams.concat(JSON.stringify(this.userSynth.get().envelope))
        this.tutorialParams = this.tutorialParams.concat(JSON.stringify(this.tutorialSynth.get().envelope))
      }
      if (this.filterRequired) {
        this.userParams = this.userParams.concat(JSON.stringify(this.userSynth.get().filter))
        this.tutorialParams = this.tutorialParams.concat(JSON.stringify(this.tutorialSynth.get().filter))
      }
      if (this.filterEnvRequired) {
        this.userParams = this.userParams.concat(JSON.stringify(this.userSynth.get().filterEnvelope))
        this.tutorialParams = this.tutorialParams.concat(JSON.stringify(this.tutorialSynth.get().filterEnvelope))
      }
      console.log(this.userParams)
      console.log(this.tutorialParams)
      if (this.userParams === this.tutorialParams) {
        this.setMatching(true)
      } else {
        this.setMatching(false)
      }
    },

    setSynthBase(synthData) {
      this.polyphony = synthData.polyphony
      this.synthType = synthTypes.get(synthData.type)
    },

    setUserSynth() {
      this.userSynth = new Tone.PolySynth(Tone.MonoSynth).toDestination()
      this.userSynth.volume.value = this.DEFAULT_VOLUME
    },

    setTutorialSynth(tutorialSynthData) {
      this.tutorialSynth = new Tone.PolySynth(Tone.MonoSynth, tutorialSynthData.parameters).toDestination()
      this.tutorialSynth.volume.value = this.DEFAULT_VOLUME
    },

    setRequirements(parameters) {
      this.oscRequired = parameters.hasOwnProperty('oscillator')
      this.envRequired = parameters.hasOwnProperty('envelope')
      this.filterRequired = parameters.hasOwnProperty('filter')
      this.filterEnvRequired = parameters.hasOwnProperty('filterEnvelope')
    },

    setMatching(matching) {
      this.matching = matching
      if (matching === false) {
        this.noOfGuesses += 1
      }
    },

    resetTutorial() {
      this.matching = undefined
      this.tutorialParams = ''
      this.showAnswer = false
      this.noOfGuesses = 0
    },

    resetTutorialParams() {
      this.tutorialParams = ''
    },

    setShowAnswer(showAnswer) {
      console.log('showing answer')
      this.showAnswer = showAnswer
    }
  }
})