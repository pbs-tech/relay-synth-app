import axios from 'axios';


const state = {
    status: '',
    token: localStorage.getItem('token') || '',
    userEmail: localStorage.getItem('userEmail') || '' ,
    userScore: localStorage.getItem('userScore') || 0,
    tutorialsCompleted: JSON.parse(localStorage.getItem('tutorialsCompleted')) || [],
    tutorialComplete: false
};

const getters = {
    isLoggedIn: state => !!state.token,
    authStatus: state => state.status,
    userEmail: state => state.userEmail,
    userScore: state => state.userScore,
    tutorialsCompleted: state => state.tutorialsCompleted,
    tutorialsCompletedCount: state => state.tutorialsCompleted.length,
    tutorialComplete: state => state.tutorialComplete
};

const actions = {
    login({commit}, user) {
        return new Promise((resolve, reject) => {
            commit('authRequest')
            axios.post('https://localhost:8000/login', user)
            .then(response => {
                const token = response.data.token;
                const user = response.data.user
                const userEmail = user.email;
                const userScore = user.totalScore
                const tutorialsCompleted = JSON.stringify(user.tutorialsCompleted)
                localStorage.setItem('token', token);
                localStorage.setItem('userEmail', userEmail);
                localStorage.setItem('userScore', userScore);
                localStorage.setItem('tutorialsCompleted', tutorialsCompleted);
                axios.defaults.headers.common['auth-token'] = token;
                commit('authSuccess', token, userEmail, userScore, tutorialsCompleted);
                resolve(response);
            })
            .catch(err => {
                commit('authError');
                localStorage.removeItem('token');
                localStorage.removeItem('userEmail');
                localStorage.removeItem('userScore');
                localStorage.removeItem('tutorialsCompleted');
                reject(err);
            })
        })
    },
    signup({commit}, user) {
        return new Promise((resolve, reject) => {
            commit('authRequest');
            axios.post('https://localhost:8000/signup', user)
            .then(response => {
                const token = response.data.token;
                const user = response.data.user;
                const userEmail = user.email;
                const userScore = user.totalScore
                const tutorialsCompleted = JSON.stringify(user.tutorialsCompleted)
                localStorage.setItem('token', token);
                localStorage.setItem('userEmail', userEmail);
                localStorage.setItem('userScore', userScore);
                localStorage.setItem('tutorialsCompleted', tutorialsCompleted);
                axios.defaults.headers.common['auth-token'] = token;
                commit('authSuccess', token, userEmail, userScore, tutorialsCompleted);
                resolve(response)
            })
            .catch(err => {
                commit('authError');
                localStorage.removeItem('token');
                localStorage.removeItem('userEmail');
                localStorage.removeItem('userScore');
                localStorage.removeItem('tutorialsCompleted');
                reject(err);
            })
        })
    },
    logout({commit}) {
        return new Promise((resolve, reject) => {
            commit('logout');
            localStorage.removeItem('token');
            localStorage.removeItem('userEmail');
            localStorage.removeItem('userScore');
            localStorage.removeItem('tutorialsCompleted');
            delete axios.defaults.headers.common['auth-token'];
            resolve();
        })
    },
    
    async updateScore({commit}, score) {
        const userEmail = localStorage.getItem('userEmail');
        const response = await axios.patch('http://localhost:8000/user/update/score',
            { email: userEmail, tutorialScore: score});
        const updatedScore = response.data.totalScore;
        localStorage.setItem('userScore', updatedScore);
        commit('updateScore',updatedScore) 
    },
    
    async updateTutorialsCompleted({commit}, tutorialCompleteId)   {
        const userEmail = localStorage.getItem('userEmail');
        commit('updateRequest');
        const response = await axios.patch('http://localhost:8000/user/update/tutorials',
        { email: userEmail, tutorialId: tutorialCompleteId});
        const tutorialsCompleted = response.data.tutorialsCompleted;
        localStorage.setItem('tutorialsCompleted', JSON.stringify(tutorialsCompleted));
        commit('updateTutorials',tutorialsCompleted); 
        commit('setTutorialComplete', true);

    },
    async isTutorialComplete({commit}, tutorialId) {
        for (let i = 0; i < state.tutorialsCompleted.length; i++) {
            if (state.tutorialsCompleted[i] == tutorialId) {
                commit('setTutorialComplete', true);
                return state.tutorialComplete;
            }
        }
        commit('setTutorialComplete', false);

        return state.tutorialComplete;
    }
    
};

const mutations = {

    setTutorialComplete(state, completed) {
        state.tutorialComplete = completed;
    },
    updateTutorials(state, tutorialsCompleted) {
        state.tutorialsCompleted = tutorialsCompleted;
    },
    updateScore(state, updatedScore) {
        state.userScore = updatedScore;
    },
    authRequest(state) {
        state.status = 'loading';
    },
    authSuccess(state, token,userEmail, userScore, tutorialsCompletedCount) {
        state.status = 'success';
        state.token = token;
        state.userEmail = userEmail;
        state.userScore = userScore;
        state.tutorialsCompletedCount = tutorialsCompletedCount
        
    },
    authError(state) {
        state.status = 'error';
    },
    logout(state) { 
        state.status = '',
        state.token = '',
        state.userEmail = '',
        state.userScore = 0,
        state.tutorialsCompleted = []
    }

};

export default {
    state,
    getters,
    actions,
    mutations,
}