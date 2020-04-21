 <template>
    <nav class="background">
        <v-app-bar>
        <v-app-bar-nav-icon color="secondary" id="drawer" @click="drawer = !drawer"></v-app-bar-nav-icon>
                <v-toolbar-title class="text--text">
                        <span id="site-title"> Relay Synth </span>
                </v-toolbar-title>
        <v-spacer></v-spacer>
        <div id="nav-buttons" v-if="!isLoggedIn">
            <router-link to="/signup">
                <v-btn id="signup-button" color="primary">
                    <span> Signup </span>
                </v-btn>
            </router-link>
            <router-link to="/login">
                <v-btn id="login-button" color="primary">
                    <span> Login </span>
                </v-btn>
            </router-link>
        </div> 
        <div class="logout" v-if="isLoggedIn">
            <v-btn id="logout-button" color="primary" @click="logoutUser">
                <span class="background--text"> Logout </span>
            </v-btn>
        </div> 
        </v-app-bar>
        <v-navigation-drawer top fixed v-model="drawer" app class="primary title white--text">
            <v-list nav>
                <v-list-item>
                    <v-icon id="drawer-close" @click="drawer = !drawer" color="background">
                        mdi-arrow-left
                    </v-icon>
                </v-list-item>
                <v-list-item v-if="isLoggedIn" class="d-flex justify-center">
                    <v-sheet class="primary background--text subtitle-1">
                        <span> {{ userEmail }} </span><br/>
                        <span> Score: {{ userScore }} </span><br/>
                        <span> Completed: {{ tutorialsCompletedCount }} / {{tutorialCount.total}} </span>
                    </v-sheet>
                </v-list-item>
                <v-list-item> <v-divider/> </v-list-item>
                <v-list-item @click="drawer=!drawer" v-for="link in links" :key="link.text" router :to="link.route">
                    <v-list-item-content>
                        <v-list-item-title class="headline background--text"> {{ link.text }} </v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
            </v-list>
        </v-navigation-drawer>
    </nav>
 </template>
<script>
import { mapGetters,  mapActions } from 'vuex';
    
export default {
    name: 'Nav',

    computed:  mapGetters(['isLoggedIn','tutorialCount','userEmail','userScore', 'tutorialsCompletedCount']),
    data() {
        return {
            componentKey: 0,
            drawer: false,
            links: [
                { text: 'Home', route: '/' },
                { text: 'About', route: '/about' },
                { text: 'Tutorials', route: '/tutorials' },
                { text: 'Play', route: '/play' },
                { text: 'Leaderboard', route: '/leaderboard' },           
            ]
        }
    },
    mounted() {
        this.fetchTutorialCount();
    },
    methods: {
        ...mapActions(['fetchTutorialCount','logout']),
        logoutUser() {
            this.logout().then(() => {
                this.$router.push('/')
            })
        },
    },
}
</script>