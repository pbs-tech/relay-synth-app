 <template>
    <nav class="bg-background">
        <v-app-bar>
        <v-app-bar-nav-icon color="secondary" id="drawer" @click="drawer = !drawer"></v-app-bar-nav-icon>
                <v-toolbar-title class="text-text">
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
                <span class="text-background"> Logout </span>
            </v-btn>
        </div> 
        </v-app-bar>
        <v-navigation-drawer top fixed v-model="drawer" app class="bg-primary text-h6 text-white">
            <v-list nav>
                <v-list-item>
                    <v-icon id="drawer-close" @click="drawer = !drawer" color="background">
                        mdi-arrow-left
                    </v-icon>
                </v-list-item>
                <v-list-item v-if="isLoggedIn" class="d-flex justify-center">
                    <v-sheet class="bg-primary text-background text-subtitle-1">
                        <span> {{ userEmail }} </span><br/>
                        <span> Score: {{ userScore }} </span><br/>
                        <span> Completed: {{ tutorialsCompletedCount }} / {{tutorialCount.total}} </span>
                    </v-sheet>
                </v-list-item>
                <v-list-item> <v-divider/> </v-list-item>
                <v-list-item @click="drawer=!drawer" v-for="link in links" :key="link.text" router :to="link.route">
                    <v-list-item-title class="text-h5 text-background"> {{ link.text }} </v-list-item-title>
                </v-list-item>
            </v-list>
        </v-navigation-drawer>
    </nav>
 </template>
<script>
import { useUserStore } from '@/stores/useUserStore'
import { useTutorialsStore } from '@/stores/useTutorialsStore'
    
export default {
    name: 'SiteNav',
    setup() {
        const userStore = useUserStore()
        const tutorialsStore = useTutorialsStore()
        return { userStore, tutorialsStore }
    },
    computed: {
        isLoggedIn() {
            return this.userStore.isLoggedIn
        },
        tutorialCount() {
            return this.tutorialsStore.tutorialCount
        },
        userEmail() {
            return this.userStore.userEmail
        },
        userScore() {
            return this.userStore.userScore
        },
        tutorialsCompletedCount() {
            return this.userStore.tutorialsCompletedCount
        }
    },
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
        this.tutorialsStore.fetchTutorialCount()
    },
    methods: {
        logoutUser() {
            this.userStore.logout().then(() => {
                this.$router.push('/')
            })
        },
    },
}
</script>