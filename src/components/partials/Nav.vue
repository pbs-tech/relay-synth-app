 <template>
    <nav class="bg-background">
        <v-app-bar>
        <v-app-bar-nav-icon color="secondary" id="drawer" @click="drawer = !drawer"></v-app-bar-nav-icon>
                <v-toolbar-title class="text-text">
                        <span id="site-title"> Relay Synth </span>
                </v-toolbar-title>
        <v-spacer></v-spacer>
        <div id="nav-buttons" v-if="!isLoggedIn">
            <v-btn id="signup-button" color="primary" @click="signupUser">
                <span> Signup </span>
            </v-btn>
            <v-btn id="login-button" color="primary" @click="loginUser">
                <span> Login </span>
            </v-btn>
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
                        <span> {{ displayName || userEmail }} </span><br/>
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
        displayName() {
            return this.userStore.displayName
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
    // No `mounted` fetch: the `immediate` watcher below already covers the
    // already-logged-in case, and having both would fetch the count twice.
    watch: {
        // GET /tutorials/count now requires a bearer token - every route but the
        // health check does. Fetching it unconditionally on mount would 401 for
        // every logged-out visitor, so it waits until there is a session. The
        // count is only rendered inside the logged-in block anyway.
        isLoggedIn: {
            immediate: true,
            handler(loggedIn) {
                if (loggedIn) {
                    this.loadTutorialCount()
                }
            }
        }
    },
    methods: {
        loadTutorialCount() {
            if (!this.isLoggedIn) {
                return
            }
            return this.tutorialsStore.fetchTutorialCount()
        },
        loginUser() {
            return this.userStore.loginWithRedirect(this.$route.fullPath)
        },
        signupUser() {
            return this.userStore.signupWithRedirect(this.$route.fullPath)
        },
        logoutUser() {
            // Auth0 logout is a full page redirect, so there is no route push
            // to make afterwards - the browser leaves for the tenant and comes
            // back to the site root.
            return this.userStore.logout()
        },
    },
}
</script>