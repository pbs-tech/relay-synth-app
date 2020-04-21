import axios from 'axios';
import Tone from "tone";
import synthTypes  from "../../util/SynthTypes"

const state = {
    polyphony: 1,
    synthType: "",
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

}

const getters = {
    tutorialSynthData: (state) => state.tutorialSynthData,
    tutorialSynth: (state) => state.tutorialSynth,
    userSynth: (state) => state.userSynth,
    userSynthData: (state) => state.userSynthData,
    matching: (state) => state.matching,
    filterRequired: (state) => state.filterRequired,
    filterEnvRequired: (state) => state.filterEnvRequired,
    envRequired: (state) => state.envRequired,
    oscRequired: (state) => state.oscRequired,
    noOfGuesses: (state) => state.noOfGuesses,
    showAnswer: (state) => state.showAnswer,
    tutorialParams: (state) => state.tutorialParams,
}

const actions = {
    async fetchTutorialSynthData({commit}, tutorialId) {
        const response = await axios.get('http://localhost:8000/tutorials/' + tutorialId + '/synth');
        commit('setRequirements', response.data.parameters);
        commit('setTutorialSynth', response.data);
    },
    async fetchSynthBase({commit}, tutorialId) {
        console.log('fetching synth settings');
        const response = await axios.get('http://localhost:8000/tutorials/' + tutorialId + '/synth/settings');
        commit('setSynthBase', response.data);

    },
    async checkAnswer({commit}) {
        if(state.oscRequired) {
            state.userParams  = JSON.stringify(state.userSynth.get().oscillator.type);
            state.tutorialParams  = JSON.stringify(state.tutorialSynth.get().oscillator.type);
        }
        if (state.envRequired) {
            state.userParams = state.userParams.concat(JSON.stringify(state.userSynth.get().envelope))
            state.tutorialParams = state.tutorialParams.concat(JSON.stringify(state.tutorialSynth.get().envelope))
        }
        if (state.filterRequired) {
            state.userParams = state.userParams.concat(JSON.stringify(state.userSynth.get().filter))
            state.tutorialParams = state.tutorialParams.concat(JSON.stringify(state.tutorialSynth.get().filter))

        }
        if(state.filterEnvRequired) {
            state.userParams = state.userParams.concat(JSON.stringify(state.userSynth.get().filterEnvelope))
            state.tutorialParams = state.tutorialParams.concat(JSON.stringify(state.tutorialSynth.get().filterEnvelope))
        }
        console.log(state.userParams);
        console.log(state.tutorialParams);
        if (state.userParams === state.tutorialParams) {
            commit('setMatching', true);
        } else {
            commit('setMatching', false);
        }
    },

}
const mutations = {

    setSynthBase(state, synthData) {
        state.polyphony = synthData.polyphony;
        state.synthType = synthTypes.get(synthData.type);
    },

    setUserSynth(state) {
        state.userSynth = new Tone.PolySynth(1, Tone.MonoSynth).toMaster();
        state.userSynth.volume.value = state.DEFAULT_VOLUME;
    },
    setTutorialSynth(state, tutorialSynthData) {
        state.tutorialSynth = new Tone.PolySynth(1,
             Tone.MonoSynth, tutorialSynthData.parameters).toMaster();
        state.tutorialSynth.volume.value = state.DEFAULT_VOLUME;
    },
    setRequirements(state, parameters) {
        if (parameters.hasOwnProperty('oscillator')) {
            state.oscRequired = true;
        } else {
            state.oscRequired = false
        }
        if (parameters.hasOwnProperty('envelope')) {
            state.envRequired = true;
        } else {
            state.envRequired = false;
        }
        if (parameters.hasOwnProperty('filter')) {
            state.filterRequired = true;
        } else {
            state.filterRequired = false;
        }
        if(parameters.hasOwnProperty('filterEnvelope')) {
            state.filterEnvRequired = true;
        } else {
            state.filterEnvRequired = false;

        }
    },
    setMatching(state, matching) {
        state.matching = matching;
        if(matching === false) {
            state.noOfGuesses +=1;
        }
    },
    resetTutorial(state) {
        state.matching = undefined;
        state.tutorialParams = '';
        state.showAnswer = false;
        state.noOfGuesses = 0;

    },
    resetTutorialParams(state) {
        state.tutorialParams = ''
    },
    setShowAnswer(state, showAnswer) {
        console.log('showing answer');
        state.showAnswer = showAnswer;
    }
}

export default {
    state,
    getters,
    actions,
    mutations
}