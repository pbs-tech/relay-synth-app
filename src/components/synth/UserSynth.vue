<template>
    <div id="user-synth" class="mx-auto">
        <div id="user-osc"></div>
        <div id="user-piano"></div>
        <div>
            <v-btn
                v-model="playButton"
                id="user-play-button"
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
            <h3 class="title  dark--text pa-5"> User Volume </h3> 
             <v-tooltip top v-model="show">
                <template v-slot:activator="{ props }">
                    <v-btn icon v-bind="props">
                        <v-icon color="secondary">mdi-help-circle</v-icon>
                    </v-btn>
                </template>
                <span class="body-2"> Changes the volume of your synth </span>
                </v-tooltip>
            </v-row>
            <div id="user-volume-slider"></div>
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
import IOMixin from '@/mixins/IOMixin';

export default {
    name: 'TutorialSynth',
    props: {
        tutorialId: String
    },
    mixins: [SynthMixin, ExampleMixin, UIMixin, IOMixin],
    setup() {
        const synthsStore = useSynthsStore()
        const exampleStore = useExampleStore()

        const userSynth = computed(() => synthsStore.userSynth)
        const tutorialSynth = computed(() => synthsStore.tutorialSynth)
        const example = computed(() => exampleStore.example)

        const fetchExample = (tutorialId) => {
            return exampleStore.fetchExample(tutorialId)
        }

        const fetchSynthBase = (tutorialId) => {
            return synthsStore.fetchSynthBase(tutorialId)
        }

        const setUserSynth = () => {
            synthsStore.setUserSynth()
        }

        return {
            userSynth,
            tutorialSynth,
            example,
            fetchExample,
            fetchSynthBase,
            setUserSynth
        }
    },
    data() {
        return {
            playButton: false,
            show: false
        }
    },

    mounted() {
        this.initUi();
        this.fetchExample(this.tutorialId);
        this.setUserSynth();
        this.setOscListener(this.userSynth, this.oscilloscope);
        this.setClickListener(this.userSynth, this.piano);
        this.setVolumeChangeListener(this.userSynth, this.volumeSlider);
        this.setKeysDown(this.userSynth, this.piano);
        this.setKeysUp(this.userSynth, this.piano);

    },
    methods: {
        initUi() {
            this.piano = this.createPiano("user-piano");
            this.oscilloscope = this.createOsc("user-osc");
            this.volumeSlider =  this.createVolumeSlider("user-volume-slider");
        },
        onExampleClick() {
            this.playButton = this.toggleExample(this.userSynth, this.playButton, this.example);
        }
    },     
    unmounted() {
        Tone.Transport.cancel();
        Tone.Transport.stop();
        this.userSynth.dispose();
        this.oscilloscope.destroy();
        this.volumeSlider.destroy();
        this.volumeNumber.destroy();
        this.piano.destroy();

    } 
}
</script>