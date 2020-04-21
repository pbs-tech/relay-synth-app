import axios from 'axios';


const state = {
    tutorialText: {},
    tutorialTitles: [],
    tutorialCount: 0,
};

const getters = {
    tutorialCount: (state) => state.tutorialCount,
    tutorialTitles: (state) => state.tutorialTitles,
    tutorialData: (state) => state.tutorialText,
};

const actions = {
    async fetchTitles({ commit }) {
        const response = await axios.get('http://localhost:8000/tutorials/titles');
        commit('setTutorialTitles', response.data);
    },
    async fetchTutorialCount({ commit }) {
        const response = await axios.get('http://localhost:8000/tutorials/count');
        commit('setTutorialCount', response.data);
    },
};

const mutations = {
    setTutorialCount: (state, tutorialCount) => (state.tutorialCount = tutorialCount),
    setTutorialTitles: (state, tutorialTitles) => (state.tutorialTitles = tutorialTitles),
    setTutorialText: (state, tutorialText) => (state.tutorialText = tutorialText),
    setPointsAvailable: (state, pointsAvailable) => (state.pointsAvailable = pointsAvailable),


};

export default {
    state,
    getters,
    actions,
    mutations,
}