<template>
    <div id="tutorial-synth" class="mx-auto">
        <div id="tutorial-osc"></div>
        <div id="tutorial-piano"></div>
        <div>
            <v-btn
            id="tutorial-play-button"
            v-model="playButton"
            fab
            dark
            @click="onExampleClick()"
            color="primary"
            class="ma-5">
            <v-icon v-if="playButton">
                    mdi-stop
                </v-icon>
                <v-icon v-else>
                    mdi-play
                </v-icon>
            </v-btn>
            <v-row align="center" justify="center">
                <h3 class="title  dark--text pa-5"> Example Volume </h3> 
                    <v-tooltip top>
                    <template v-slot:activator="{ props }">
                        <v-btn icon v-bind="props">
                            <v-icon color="secondary">mdi-help-circle</v-icon>
                        </v-btn>
                    </template>
                    <span class="body-2"> Changes the volume of the tutorial synth </span>
                    </v-tooltip>
            </v-row>
            <div id="tutorial-volume-slider"></div>
        </div>                                   
    </div>
</template>
<script>
import Nexus from "nexusui";
import * as Tone from "tone";
import { computed } from 'vue'
import { useSynthsStore } from '@/stores/useSynthsStore'
import { useExampleStore } from '@/stores/useExampleStore'
import SynthMixin from '@/mixins/SynthMixin';
import ExampleMixin from '@/mixins/ExampleMixin';
import UIMixin from '@/mixins/UIMixin';

export default {
    name: 'TutorialSynth',
    props: {
        tutorialId: String
    },
    mixins: [SynthMixin, ExampleMixin, UIMixin],
    setup() {
        const synthsStore = useSynthsStore()
        const exampleStore = useExampleStore()

        const tutorialSynthData = computed(() => synthsStore.tutorialSynthData)
        const tutorialSynth = computed(() => synthsStore.tutorialSynth)
        const example = computed(() => exampleStore.example)

        const fetchTutorialSynthData = (tutorialId) => {
            return synthsStore.fetchTutorialSynthData(tutorialId)
        }

        const fetchExample = (tutorialId) => {
            return exampleStore.fetchExample(tutorialId)
        }

        return {
            tutorialSynthData,
            tutorialSynth,
            example,
            fetchTutorialSynthData,
            fetchExample
        }
    },
    data() {
        return {
            playButton: false,
        }
    },

    mounted() {
        this.initUi();
        this.fetchTutorialSynthData(this.tutorialId).then(response => {
            this.setOscListener(this.tutorialSynth, this.oscilloscope);
            this.setClickListener(this.tutorialSynth, this.piano);
            this.setVolumeChangeListener(this.tutorialSynth, this.volumeSlider);
        })
    },
    methods: {
        initUi() {
            this.piano = this.createPiano("tutorial-piano");
            this.oscilloscope = this.createOsc("tutorial-osc");
            this.volumeSlider =  this.createVolumeSlider("tutorial-volume-slider");
        },
        onExampleClick() {
            this.playButton = this.toggleExample(this.tutorialSynth, this.playButton, this.example);
        }
    },
    unmounted() {
        Tone.Transport.cancel();
        Tone.Transport.stop();
        this.oscilloscope.destroy();
        this.volumeSlider.destroy();
        this.volumeNumber.destroy();
        this.piano.destroy();
    }  
}
</script>