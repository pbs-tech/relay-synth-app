<template>
    <v-container>
        <v-divider/>
        <v-container class="my-5">
            <v-row>
                <v-col
                    v-for="tutorial in tutorials"
                    :key="tutorial.number"
                    col="4" xl="3" lg="3"
                    md="4" sm="6" xs="6">
                        <router-link :to="'/tutorials/' + tutorial.number">
                            <TutorialCard :id="tutorial.number" v-bind:tutorial="tutorial"/>
                        </router-link>
                </v-col>
            </v-row>
        </v-container>
    </v-container>
</template>

<script>
import { computed } from 'vue'
import { useUserStore } from '@/stores/useUserStore'
import TutorialCard from '@/components/tutorial/list/TutorialCard'

export default {
    name: 'TutorialList',
    props: {
        tutorials: Array,
    },
    components: {
        TutorialCard
    },
    setup() {
        const userStore = useUserStore()

        const tutorialsCompleted = computed(() => userStore.tutorialsCompleted)

        return {
            tutorialsCompleted
        }
    },
    methods: {
        isTutorialTitleComplete(number) {
            if (this.tutorialsCompleted.includes(number)) {
                return true;
            } else {
                return false;
            }
        }
    }
}
</script>
