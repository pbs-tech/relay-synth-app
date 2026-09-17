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
import { computed } from 'vue'
import { useSynthsStore } from '@/stores/useSynthsStore'
import SynthMixin from '@/mixins/SynthMixin';
import UIMixin from '@/mixins/UIMixin';

export default {
    name: 'Oscillator',
    mixins: [SynthMixin, UIMixin],
    setup() {
        const synthsStore = useSynthsStore()

        const userSynth = computed(() => synthsStore.userSynth)

        const setMatching = (value) => {
            synthsStore.setMatching(value)
        }

        return {
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
        this.initUi();
        this.setOscillator(this.userSynth, this.selectOscillator);
    },
    
    methods: {
        initUi() {
            this.selectOscillator = this.createSelect("osc-select", this.waveforms);

        },
    }
}

</script>