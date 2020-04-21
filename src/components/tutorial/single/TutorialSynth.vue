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
                    <template v-slot:activator="{ on }">
                        <v-btn icon v-on="on">
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
import Tone from "tone";
import { mapGetters, mapActions } from 'vuex';
import SynthMixin from '@/mixins/SynthMixin';
import ExampleMixin from '@/mixins/ExampleMixin';
import UIMixin from '@/mixins/UIMixin';

export default {
    name: 'TutorialSynth',
    props: {
        tutorialId: String
    },
    mixins: [SynthMixin, ExampleMixin, UIMixin],
    
    data() {
        return {
            playButton: false,
        }
    },
    computed: mapGetters(['tutorialSynthData','tutorialSynth','example']),

    mounted() {
        this.initUi();
        this.fetchTutorialSynthData(this.tutorialId).then(response => {
            this.setOscListener(this.tutorialSynth, this.oscilloscope);
            this.setClickListener(this.tutorialSynth, this.piano);
            this.setVolumeChangeListener(this.tutorialSynth, this.volumeSlider);
        })
    },
    methods: {
        ...mapActions(['fetchTutorialSynthData','fetchExample']),
        initUi() {
            this.piano = this.createPiano("tutorial-piano");
            this.oscilloscope = this.createOsc("tutorial-osc");
            this.volumeSlider =  this.createVolumeSlider("tutorial-volume-slider");
        },
        onExampleClick() {
            this.playButton = this.toggleExample(this.tutorialSynth, this.playButton, this.example);
        }
    },
    destroyed() {
        Tone.Transport.cancel();
        Tone.Transport.stop();
        this.oscilloscope.destroy();
        this.volumeSlider.destroy();
        this.volumeNumber.destroy();
        this.piano.destroy();
    }  
}
</script>