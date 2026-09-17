<template>
    <v-container class="my-5">
        <TutorialText v-bind:tutorialId="tutorialId"/>
            <v-row v-if="showAnswer" justify="center" align="center"> 
                <h2 class="text-h6 text-secondary pa-1"> Answer: </h2>{{ tutorialParams }}
            </v-row>
            <v-row justify="center" align="center"> 
                <v-col justify="center" align="center">
                    <v-row justify="center" align="center">
                        <h2  class="pa-1 text-h6"> Example Sound</h2>
                        <v-tooltip location="top">
                            <template v-slot:activator="{ props }">
                                <v-btn icon v-bind="props">
                                    <v-icon color="secondary">mdi-help-circle</v-icon>
                                </v-btn>
                            </template>
                            <span> This is the sound you need to replicate, click on the piano or the play button to hear and see it. </span>
                        </v-tooltip>
                    </v-row>
                    <TutorialSynth v-bind:tutorialId="tutorialId"/>
                </v-col>
                <v-col justify="center" align="center">
                    <v-row justify="center" align="center">
                        <h2 class="pa-1 text-h6 text-dark"> Your Sound </h2>
                        <v-tooltip location="top">
                            <template v-slot:activator="{ props }">
                                <v-btn icon v-bind="props">
                                    <v-icon color="secondary">mdi-help-circle</v-icon>
                                </v-btn>
                            </template>
                            <span class="text-body-2"> This is the sound you are creating, click on the piano, use your keyboard or the play button to hear and see it.</span>
                        </v-tooltip>
                    </v-row>
                    <UserSynth v-bind:tutorialId="tutorialId"/>
                </v-col>
            </v-row>
            <v-row justify="center" align="center">
                <v-col>
                    <Oscillator  v-if="oscRequired"/>
                    <AmplitudeEnvelope v-if="envRequired"/>
                    <FilterSettings v-if="filterRequired"/>
                    <FilterEnvelope v-if="filterEnvRequired"/>

                </v-col>
            </v-row>
            <CorrectAnswerAlert/>
            <IncorrectAnswerAlert/>

        <TutorialCheckButton v-bind:tutorialId="tutorialId"/>
    </v-container>

</template>

<script>
import { computed } from 'vue'
import { useSynthsStore } from '@/stores/useSynthsStore'
import Nexus from "nexusui";
import TutorialText from "@/components/tutorial/single/TutorialText";
import TutorialSynth from "@/components/tutorial/single/TutorialSynth";
import TutorialCheckButton from "@/components/partials/TutorialCheckButton";
import UserSynth from "@/components/synth/UserSynth";
import Oscillator from "@/components/synth/Oscillator";
import CorrectAnswerAlert from "@/components/partials/CorrectAnswerAlert";
import IncorrectAnswerAlert from "@/components/partials/IncorrectAnswerAlert";
import AmplitudeEnvelope from "@/components/synth/AmplitudeEnvelope";
import FilterSettings from "@/components/synth/FilterSettings";
import FilterEnvelope from '@/components/synth/FilterEnvelope'

export default {
    name: 'TutorialSingle',
    components: {
        TutorialText,
        TutorialSynth,
        TutorialCheckButton,
        CorrectAnswerAlert,
        IncorrectAnswerAlert,
        UserSynth,
        Oscillator,
        AmplitudeEnvelope,
        FilterSettings,
        FilterEnvelope

    },
    setup() {
        const synthsStore = useSynthsStore()

        const envRequired = computed(() => synthsStore.envRequired)
        const filterRequired = computed(() => synthsStore.filterRequired)
        const oscRequired = computed(() => synthsStore.oscRequired)
        const filterEnvRequired = computed(() => synthsStore.filterEnvRequired)
        const showAnswer = computed(() => synthsStore.showAnswer)
        const tutorialParams = computed(() => synthsStore.tutorialParams)

        const resetTutorial = () => {
            synthsStore.resetTutorial()
        }

        return {
            envRequired,
            filterRequired,
            oscRequired,
            filterEnvRequired,
            showAnswer,
            tutorialParams,
            resetTutorial
        }
    },
    data() {
        return {
            answer: "",
        }
    },
    created() {
        this.tutorialId = this.$route.params.id;
        Nexus.colors.accent = this.$vuetify.theme.current.colors.primary;
    },
    unmounted() {
        this.resetTutorial();
    }
}
</script>