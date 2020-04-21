<template>
    <v-snackbar
    color="green"
    :top="true"
    :value="matching === true"
    :timeout="timeout">
            <span class="font-weight-bold"> Correct!! You have completed this tutorial. </span>
            <span v-if="!tutorialComplete"> + {{ pointsAvailable }} </span>
            <v-btn
            color="white"
            text
            @click="reset()"
            > 
                Close
            </v-btn>
    </v-snackbar>
</template>
<script>

import { mapGetters, mapMutations, mapActions } from 'vuex';


export default {
    name: 'CorrectAnswerAlert',
    computed:  mapGetters(['matching','tutorialComplete','pointsAvailable']),
    data() {
        return {
            timeout: 0
        }
    },
    methods: {
        ...mapMutations(['setMatching']),
        reset() {
            this.setMatching(undefined);
        }
    }

}
</script>