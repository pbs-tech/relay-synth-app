import Vue from 'vue';
import Vuex from 'vuex';
import Tutorials from './modules/tutorials';
import User from './modules/user';
import Leaderboard from './modules/leaderboard';
import Synths from './modules/synths';
import Tutorial from './modules/tutorial';
import Example from './modules/examples'

Vue.use(Vuex);

export default new Vuex.Store({
    modules: {
        Tutorials, 
        Tutorial,
        User,
        Synths,
        Leaderboard,
        Example
    }
})
