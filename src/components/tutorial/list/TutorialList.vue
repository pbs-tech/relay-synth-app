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
import { mapGetters } from 'vuex';
import TutorialCard from '@/components/tutorial/list/TutorialCard'

export default {
    name: 'TutorialList',
    props: {
        tutorials: Array,
    },
    components: {
        TutorialCard
    },
    methods: {
        isTutorialTitleComplete(number) {
            if (this.tutorialsCompleted.includes(number)) {
                return true;
            } else {
                return false;
            }
        }
    },
    computed: mapGetters([ 'tutorialsCompleted']),


}
</script>
