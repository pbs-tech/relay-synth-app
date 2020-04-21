<template>
    <v-fab-transition>
        <v-btn id="check-answer" fab dark fixed bottom right x-large color="primary" @click="onCheckAnswerClicked()">
            <v-icon color="background">
                mdi-send
            </v-icon>
        </v-btn>
    </v-fab-transition>
</template>
<script>
import { mapActions, mapGetters, mapMutations } from 'vuex';

export default {
    name: 'TutorialCheckButton',
    computed:  mapGetters(['correct', 'incorrect', 'pointsAvailable', 'tutorialComplete', 'matching']),
    props: {
        tutorialId: String,
    },
    methods: {
        ...mapActions(['checkAnswer','updateScore', 'updateTutorialsCompleted', 'isTutorialComplete']),
        onCheckAnswerClicked() {
            this.checkAnswer();
            if(this.matching === true && this.tutorialComplete === false) {
                this.updateScore(this.pointsAvailable);
                this.updateTutorialsCompleted(this.tutorialId);
            }
        },
    },
}
</script>
    