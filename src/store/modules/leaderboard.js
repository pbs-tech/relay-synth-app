import axios from 'axios';


const state = {
    userScores: [],
};

const getters = {
    userScores: state => state.userScores,
};

const actions = {
    async fetchScores({ commit }) { 
        const response = await axios.get('http://localhost:8000/leaderboard');
        commit('setScores', response.data.users);
        commit('setRanks');

    }
};

const mutations = {
    setScores: (state, userScores) => (state.userScores = userScores),
    setRanks(state) {
        for(let i = 0; i < state.userScores.length; i++) {
            state.userScores[i].rank = i+1;
        }
    }
};

export default {
    state,
    getters,
    actions,
    mutations,
}