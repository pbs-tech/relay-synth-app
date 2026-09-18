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
import { computed } from 'vue'
import { useSynthsStore } from '@/stores/useSynthsStore'

export default {
    name: 'IncorrectAnswerAlert',
    setup() {
        const synthsStore = useSynthsStore()

        const matching = computed(() => synthsStore.matching)
        const noOfGuesses = computed(() => synthsStore.noOfGuesses)

        const setMatching = (value) => {
            synthsStore.setMatching(value)
        }

        const setShowAnswer = (value) => {
            synthsStore.setShowAnswer(value)
        }

        const reset = () => {
            setMatching(undefined)
        }

        return {
            matching,
            noOfGuesses,
            setMatching,
            setShowAnswer,
            reset
        }
    },
    data() {
        return {
            timeout: 0,
        }
    }
}
</script>