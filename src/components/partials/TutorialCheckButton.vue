<template>
    <v-fab-transition>
        <v-btn id="check-answer" class="check-answer-fab" icon size="x-large" color="primary" @click="onCheckAnswerClicked()">
            <v-icon color="background">
                mdi-send
            </v-icon>
        </v-btn>
    </v-fab-transition>
</template>
<script>
import { computed } from 'vue'
import { useSynthsStore } from '@/stores/useSynthsStore'
import { useUserStore } from '@/stores/useUserStore'
import { useTutorialStore } from '@/stores/useTutorialStore'

export default {
    name: 'TutorialCheckButton',
    props: {
        tutorialId: String,
    },
    setup(props) {
        const synthsStore = useSynthsStore()
        const userStore = useUserStore()
        const tutorialStore = useTutorialStore()

        const correct = computed(() => synthsStore.matching === true)
        const incorrect = computed(() => synthsStore.matching === false)
        const pointsAvailable = computed(() => tutorialStore.pointsAvailable)
        const tutorialComplete = computed(() => userStore.tutorialComplete)
        const matching = computed(() => synthsStore.matching)

        const checkAnswer = () => {
            return synthsStore.checkAnswer()
        }

        // One call replaces the old updateScore + updateTutorialsCompleted
        // pair. The server reads the point value from the tutorial record and
        // takes the player from the token, so the client no longer says who it
        // is or how much it should be awarded. It is also atomic, so the double
        // click this button invites cannot double-award.
        const completeTutorial = (tutorialId) => {
            return userStore.completeTutorial(tutorialId)
        }

        const isTutorialComplete = (tutorialId) => {
            return userStore.isTutorialComplete(tutorialId)
        }

        const onCheckAnswerClicked = () => {
            checkAnswer()
            if(matching.value === true && tutorialComplete.value === false) {
                completeTutorial(props.tutorialId)
            }
        }

        return {
            correct,
            incorrect,
            pointsAvailable,
            tutorialComplete,
            matching,
            checkAnswer,
            completeTutorial,
            isTutorialComplete,
            onCheckAnswerClicked
        }
    }
}
</script>

<style scoped>
/* Vuetify 3 removed the fixed/bottom/right props this button used to rely on. */
.check-answer-fab {
    position: fixed;
    right: 24px;
    bottom: 24px;
    z-index: 5;
}
</style>
