import axios from 'axios';



const state = {
    data: {
        number:'',
        title: '',
        difficulty: '',
        category: '',
        pointsAvailable : '',
        text: ''
    },
    completed: undefined
};

const getters = {
    tutorial: (state) => state.data,
    pointsAvailable: (state) => state.data.pointsAvailable,
    category: (state) => state.data.category,
    text: (state) => state.data.text,
    title: (state) => state.data.title,
    difficulty: (state) => state.data.difficulty,
    number: (state) => state.data.number
};


const actions = {
    async fetchTutorialText({ commit }, tutorialId) {
        const response = await axios.get('http://localhost:8000/tutorials/' + tutorialId + '/text');
        commit('setTutorialData', response.data);
    },
};


const mutations = {
    setTutorialData: (state, tutorialData) => (state.data = tutorialData)
}

export default {
    state,
    getters,
    actions,
    mutations
}