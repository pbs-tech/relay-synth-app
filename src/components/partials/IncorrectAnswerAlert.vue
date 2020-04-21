<template>
    <v-snackbar
    color="red"
    :timeout="timeout"
    :top="true"
    :value="matching === false"
    class="font-weight-bold">
        Incorrect!! Try playing the example again 
        <v-btn v-if="noOfGuesses >= 3"
        color="background"
        text
        @click="setShowAnswer(true)"
        > 
            Show Answer
        </v-btn>
        <v-btn
        color="background"
        text
        @click="reset()"
        > 
            Close
        </v-btn>
    </v-snackbar>
</template>
<script>

import { mapGetters, mapMutations } from 'vuex';


export default {
    name: 'IncorrectAnswerAlert',
    computed:  mapGetters(['matching','noOfGuesses']),
    data() {
        return {
            timeout: 0,
        }
    },
    methods: {
    ...mapMutations(['setMatching','setShowAnswer']),
        reset() {
            this.setMatching(undefined);
        }
    }
}
</script>