<template>
    <v-container>
        <v-row justify="center" align="center" no-gutters>
            <h3 class="title pa-5"> Oscillator </h3> 
            <v-tooltip top>
                <template v-slot:activator="{ on }">
                    <v-btn icon v-on="on">
                        <v-icon color="secondary">mdi-help-circle</v-icon>
                    </v-btn>
                </template>
                <span class="body-2 background--text"> Changes the sound of the synth and the shape of the visualiser </span>
            </v-tooltip>
        </v-row>
        <v-row  justify="center" align="center">      
            <div id="osc-select"></div>
        </v-row>
    </v-container>
</template>
<script>
import Tone from "tone";
import Nexus from "nexusui";
import { mapGetters, mapMutations } from 'vuex';
import SynthMixin from '@/mixins/SynthMixin';
import UIMixin from '@/mixins/UIMixin';

export default {
    name: 'Oscillator',
    mixins: [SynthMixin, UIMixin], 
    data() {
        return {
            waveforms: ["Waveform 1", "Waveform 2", "Waveform 3", "Waveform 4"],
            userWaveform: null,
        }
    },
    computed: mapGetters(['userSynthData','userSynth',]),
    mounted() {
        this.initUi();
        this.setOscillator(this.userSynth, this.selectOscillator);
    },
    
    methods: {
        ...mapMutations(['setMatching']),
        initUi() {
            this.selectOscillator = this.createSelect("osc-select", this.waveforms);

        },
    }
}

</script>