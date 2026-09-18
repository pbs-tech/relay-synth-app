<template>
    <v-container>
        <v-row align="center" justify="center">
            <h3 class="text-h6 pa-5"> Amplitude Envelope </h3>
            <v-tooltip location="top">
                <template v-slot:activator="{ props }">
                    <v-btn icon v-bind="props">
                        <v-icon color="secondary">mdi-help-circle</v-icon>
                    </v-btn>
                </template>
            <span> This envelope controls the volume output </span>
        </v-tooltip>
        </v-row>
        <v-row no-gutters>
            <v-col justify="center" align="center">
                <div id="amp-env"></div>
            </v-col>
            <v-col>
                <v-row class="py-1 align-center">
                    <h4 id="amp-attack-title" class="text-subtitle-2"> Attack (ms): </h4> 
                    <v-spacer/>
                    <div id="amp-attack-slider"></div>
                    <v-spacer/>
                    <div id="amp-attack-value"></div>
                </v-row>
                <v-row class="py-1 align-center">
                    <h4 id="amp-decay-title" class="text-subtitle-2"> Decay (ms): </h4>
                    <v-spacer/>
                    <div id="amp-decay-slider"></div>
                    <v-spacer/>
                    <div id="amp-decay-value"></div>
                </v-row>
                <v-row class="py-1 align-center">
                    <h4 id="amp-sustain-title" class="text-subtitle-2"> Sustain (dB): </h4>
                    <v-spacer/>
                    <div id="amp-sustain-slider"></div>
                    <v-spacer/>
                    <div id="amp-sustain-value"></div>
                </v-row>
                <v-row class="py-1 align-center">
                    <h4 id="amp-release-title" class="text-subtitle-2"> Release (ms): </h4> 
                    <v-spacer/>
                    <div id="amp-release-slider"></div>
                    <v-spacer/>
                    <div id="amp-release-value"></div>
                </v-row>
            </v-col>
        </v-row>
    </v-container>
</template>


<script>
import * as Tone from "tone";
import axios from "axios";
import Nexus from "nexusui";
import { computed } from 'vue'
import { useSynthsStore } from '@/stores/useSynthsStore'
import EnvelopeMixin from '@/mixins/EnvelopeMixin';
import UIMixin from '@/mixins/UIMixin';

export default {
    name: 'Envelope',
    mixins: [EnvelopeMixin, UIMixin],
    setup() {
        const synthsStore = useSynthsStore()

        const userSynthData = computed(() => synthsStore.userSynthData)
        const userSynth = computed(() => synthsStore.userSynth)

        return {
            userSynthData,
            userSynth
        }
    },
    data() {
        return {
            startPoint: { x: 0.01, y: 0.01 },
        }
    },
    created() {
       // Nexus needs a real AudioContext. Tone 13 proxied the AudioContext
       // methods on Tone.context, but Tone 14 wraps it, so Nexus called
       // createScriptProcessor on the wrapper and threw. Hand it the raw one,
       // which keeps Nexus and Tone on the same context.
       Nexus.context = Tone.getContext().rawContext;
    },

    mounted() {
        // Nexus resolves its mount points with document.getElementById, and
        // mounted() does not guarantee this subtree is in the document yet -
        // under a lazily routed view in Vue 3 it is not, so the lookup returned
        // nothing and Nexus threw before any control was built. Defer a tick.

        this.$nextTick(() => {
            this.initUi();
            this.setEnvAttackListener(this.userSynth, this.attackSlider, this.envelope);
            this.setEnvDecayListener(this.userSynth, this.decaySlider, this.envelope);
            this.setEnvSustainListener(this.userSynth, this.sustainSlider, this.envelope);
            this.setEnvReleaseListener(this.userSynth, this.releaseSlider, this.envelope);
    

        });

    },
    methods: {
        initUi() {
            let iAttack = 0;
            let iDecay = 0.25;
            let iSustain = 0.5;
            let iRelease = 1;
            
            let initialParams = { iAttack, iDecay, iSustain, iRelease};
            let envPlotPoints =  [this.startPoint, 
            {x: iAttack, y: 0.99},
            {x: iDecay, y: iSustain},
            {x: iRelease, y: 0.01}]
            this.envelope = this.createAmpEnvelope("amp-env", envPlotPoints);
            this.setEnvClickListener(this.userSynth, this.envelope, envPlotPoints, initialParams);
            this.attackSlider = this.createEnvelopeSlider("amp-attack-slider", iAttack);
            this.decaySlider = this.createEnvelopeSlider("amp-decay-slider", iDecay);
            this.sustainSlider = this.createEnvelopeSlider("amp-sustain-slider", iSustain);
            this.releaseSlider = this.createEnvelopeSlider("amp-release-slider", iRelease);
            this.attackValue = this.createNumber("amp-attack-value");
            this.decayValue = this.createNumber("amp-decay-value")
            this.sustainValue = this.createNumber("amp-sustain-value");
            this.releaseValue = this.createNumber("amp-release-value")
            this.attackValue.link(this.attackSlider);
            this.decayValue.link(this.decaySlider)
            this.sustainValue.link(this.sustainSlider);
            this.releaseValue.link(this.releaseSlider);
        },
    }

}

</script>