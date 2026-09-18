<template>
    <v-container>
        <v-row justify="center" align="center" no-gutters>
            <h3 class="text-h6 pa-5"> Oscillator </h3> 
            <v-tooltip location="top">
                <template v-slot:activator="{ props }">
                    <v-btn icon v-bind="props">
                        <v-icon color="secondary">mdi-help-circle</v-icon>
                    </v-btn>
                </template>
                <span class="text-body-2 text-background"> Changes the sound of the synth and the shape of the visualiser </span>
            </v-tooltip>
        </v-row>
        <v-row  justify="center" align="center">      
            <div id="osc-select"></div>
        </v-row>
    </v-container>
</template>
<script>
import * as Tone from "tone";
import Nexus from "nexusui";
import { computed } from 'vue'
import { useSynthsStore } from '@/stores/useSynthsStore'
import SynthMixin from '@/mixins/SynthMixin';
import UIMixin from '@/mixins/UIMixin';

export default {
    name: 'Oscillator',
    mixins: [SynthMixin, UIMixin],
    setup() {
        const synthsStore = useSynthsStore()

        const userSynthData = computed(() => synthsStore.userSynthData)
        const userSynth = computed(() => synthsStore.userSynth)

        const setMatching = (value) => {
            synthsStore.setMatching(value)
        }

        return {
            userSynthData,
            userSynth,
            setMatching
        }
    },
    data() {
        return {
            waveforms: ["Waveform 1", "Waveform 2", "Waveform 3", "Waveform 4"],
            userWaveform: null,
        }
    },
    mounted() {
        // Nexus resolves its mount points with document.getElementById, and
        // mounted() does not guarantee this subtree is in the document yet -
        // under a lazily routed view in Vue 3 it is not, so the lookup returned
        // nothing and Nexus threw before any control was built. Defer a tick.
        this.$nextTick(() => {
            this.initUi();
            this.setOscillator(this.userSynth, this.selectOscillator);
    
        });
    },
    
    methods: {
        initUi() {
            this.selectOscillator = this.createSelect("osc-select", this.waveforms);

        },
    }
}

</script>