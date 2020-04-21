import axios from 'axios';

const state = {
    example: ''
}

const getters = {
    example: (state) => state.example
}

const actions = {
    async fetchExample({ commit }, tutorialId) {
        const response = await axios.get('http://localhost:8000/tutorials/' + tutorialId + '/example');
        commit('setExample', response.data.example);
    }
}

const mutations = {
    setExample: (state, example) => (state.example = example)
}

export default {
    state,
    getters,
    actions,
    mutations
}