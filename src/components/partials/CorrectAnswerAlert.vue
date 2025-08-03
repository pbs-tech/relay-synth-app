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
import { computed } from 'vue'
import { useSynthsStore } from '@/stores/useSynthsStore'
import { useUserStore } from '@/stores/useUserStore'
import { useTutorialStore } from '@/stores/useTutorialStore'

export default {
    name: 'CorrectAnswerAlert',
    setup() {
        const synthsStore = useSynthsStore()
        const userStore = useUserStore()
        const tutorialStore = useTutorialStore()

        const matching = computed(() => synthsStore.matching)
        const tutorialComplete = computed(() => userStore.tutorialComplete)
        const pointsAvailable = computed(() => tutorialStore.pointsAvailable)

        const setMatching = (value) => {
            synthsStore.setMatching(value)
        }

        const reset = () => {
            setMatching(undefined)
        }

        return {
            matching,
            tutorialComplete,
            pointsAvailable,
            setMatching,
            reset
        }
    },
    data() {
        return {
            timeout: 0
        }
    }
}
</script>