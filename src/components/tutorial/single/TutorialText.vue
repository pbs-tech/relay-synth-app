<template>
    <v-container>
        <div id="header" class="my-2 text-secondary" >
            <v-row>
                <h1 class="text-h2 py-2"> 
                    Tutorial {{ tutorial.number }}: {{ tutorial.name }}
                </h1>
                <v-spacer/>
                <v-tooltip top>
                    <template v-slot:activator="{ props }">
                        <v-btn  large icon v-bind="props">
                            <v-icon color="secondary">mdi-help-circle</v-icon>
                        </v-btn>
                    </template>
                    <span class="text-body-2"> Try and re-create the tutorial sound by changing the parameters at the bottom. Press the send button to submit your answer.</span>
                </v-tooltip>
            </v-row>
            <div class="mx-6">

                <h2 class="text-h5">
                    Category: {{ tutorial.category }}  
                </h2>

                <h2 class ="headline">
                    Difficulty: {{ tutorial.difficulty }}
                </h2>

                <h2 class ="headline">
                    Points Available: 
                        <span v-if="!tutorialComplete"> {{ tutorial.pointsAvailable }} </span>
                        <span v-else> 0 </span>
                </h2>     
                <h2 v-if="tutorialComplete" class="text-h5 font-weight-bold text-green">
                    Completed
                </h2>
            </div>
        </div>
        <v-divider/>
        <div id="text" class="pa-8 mx-auto text-body-1"> 
            {{ tutorial.text }} 
        </div>
    </v-container>
</template>
<script>
import { computed } from 'vue'
import { useUserStore } from '@/stores/useUserStore'
import { useTutorialStore } from '@/stores/useTutorialStore'

export default {
    name:'TutorialText',
    props: {
        tutorialId: String,
    },
    setup() {
        const userStore = useUserStore()
        const tutorialStore = useTutorialStore()

        const tutorialComplete = computed(() => userStore.tutorialComplete)
        const tutorial = computed(() => tutorialStore.tutorial)

        const fetchTutorialText = (tutorialId) => {
            return tutorialStore.fetchTutorialText(tutorialId)
        }

        const isTutorialComplete = (tutorialId) => {
            return userStore.isTutorialComplete(tutorialId)
        }

        return {
            tutorialComplete,
            tutorial,
            fetchTutorialText,
            isTutorialComplete
        }
    },
    created() {
        this.fetchTutorialText(this.tutorialId);
        this.isTutorialComplete(this.tutorialId)
    }
}
</script>