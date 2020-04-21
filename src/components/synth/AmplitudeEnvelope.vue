<template>
    <v-container>
        <v-row align="center" justify="center">
            <h3 class="title pa-5"> Amplitude Envelope </h3>
            <v-tooltip top>
                <template v-slot:activator="{ on }">
                    <v-btn icon v-on="on">
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
                    <h4 id="amp-attack-title" class="subtitle-2"> Attack (ms): </h4> 
                    <v-spacer/>
                    <div id="amp-attack-slider"></div>
                    <v-spacer/>
                    <div id="amp-attack-value"></div>
                </v-row>
                <v-row class="py-1 align-center">
                    <h4 id="amp-decay-title" class="subtitle-2"> Decay (ms): </h4>
                    <v-spacer/>
                    <div id="amp-decay-slider"></div>
                    <v-spacer/>
                    <div id="amp-decay-value"></div>
                </v-row>
                <v-row class="py-1 align-center">
                    <h4 id="amp-sustain-title" class="subtitle-2"> Sustain (dB): </h4>
                    <v-spacer/>
                    <div id="amp-sustain-slider"></div>
                    <v-spacer/>
                    <div id="amp-sustain-value"></div>
                </v-row>
                <v-row class="py-1 align-center">
                    <h4 id="amp-release-title" class="subtitle-2"> Release (ms): </h4> 
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
import Tone from "tone";
import axios from "axios";
import Nexus from "nexusui";
import {mapGetters, mapMutations } from 'vuex';
import EnvelopeMixin from '@/mixins/EnvelopeMixin';
import UIMixin from '@/mixins/UIMixin';

export default {
    name: 'Envelope',
    mixins: [EnvelopeMixin, UIMixin],
    data() {
        return {
            startPoint: { x: 0.01, y: 0.01 },
        }
    },
    created() {
       Nexus.context = Tone.context;
    },
    computed: mapGetters(['userSynthData','userSynth']),

    mounted() {
        this.initUi();
        this.setEnvAttackListener(this.userSynth, this.attackSlider, this.envelope);
        this.setEnvDecayListener(this.userSynth, this.decaySlider, this.envelope);
        this.setEnvSustainListener(this.userSynth, this.sustainSlider, this.envelope);
        this.setEnvReleaseListener(this.userSynth, this.releaseSlider, this.envelope);
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