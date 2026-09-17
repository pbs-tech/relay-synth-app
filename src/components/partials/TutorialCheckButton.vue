<template>
    <v-fab-transition>
        <v-btn id="check-answer" icon size="x-large" color="primary" class="check-answer-fab" @click="onCheckAnswerClicked()">
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

        const updateScore = (score) => {
            return userStore.updateScore(score)
        }

        const updateTutorialsCompleted = (tutorialId) => {
            return userStore.updateTutorialsCompleted(tutorialId)
        }

        const isTutorialComplete = (tutorialId) => {
            return userStore.isTutorialComplete(tutorialId)
        }

        const onCheckAnswerClicked = () => {
            checkAnswer()
            if(matching.value === true && tutorialComplete.value === false) {
                updateScore(pointsAvailable.value)
                updateTutorialsCompleted(props.tutorialId)
            }
        }

        return {
            correct,
            incorrect,
            pointsAvailable,
            tutorialComplete,
            matching,
            checkAnswer,
            updateScore,
            updateTutorialsCompleted,
            isTutorialComplete,
            onCheckAnswerClicked
        }
    }
}
</script>
    
<style scoped>
/* Replaces the removed `fixed bottom right` props from Vuetify 2 */
.check-answer-fab {
    position: fixed;
    right: 24px;
    bottom: 24px;
    z-index: 5;
}
</style>
