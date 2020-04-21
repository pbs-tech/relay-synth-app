<template>
    <v-container>
    <v-row align="center" justify="center">
        <h3 class="title pa-5"> Filter Envelope </h3>
        <v-tooltip top>
            <template v-slot:activator="{ on }">
                <v-btn icon v-on="on">
                    <v-icon color="secondary">mdi-help-circle</v-icon>
                </v-btn>
            </template>
            <span> This envelope controls the filter output </span>
        </v-tooltip>
    </v-row>
    <v-row no-gutters>
        <v-col justify="center" align="center">
            <div id="filter-env"></div>
        </v-col>
        <v-col>
            <v-row class="py-1 align-center">
                <h4 id="filter-attack-title" class="subtitle-2"> Attack (ms): </h4> 
                <v-spacer/>
                <div id="filter-attack-slider"></div>
                <v-spacer/>
                <div id="filter-attack-value"></div>
            </v-row>
            <v-row class="py-1 align-center">
                <h4 id="filter-decay-title" class="subtitle-2"> Decay (ms): </h4>
                <v-spacer/>
                <div id="filter-decay-slider"></div>
                <v-spacer/>
                <div id="filter-decay-value"></div>
            </v-row>
            <v-row class="py-1 align-center">
                <h4 id="filter-sustain-title" class="subtitle-2"> Sustain (dB): </h4>
                <v-spacer/>
                <div id="filter-sustain-slider"></div>
                <v-spacer/>
                <div id="filter-sustain-value"></div>
            </v-row>
            <v-row class="py-1 align-center">
                <h4 id="filter-release-title" class="subtitle-2"> Release (ms): </h4> 
                <v-spacer/>
                <div id="filter-release-slider"></div>
                <v-spacer/>
                <div id="filter-release-value"></div>
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
import FilterEnvelopeMixin from '@/mixins/FilterEnvelopeMixin';
import UIMixin from '@/mixins/UIMixin';

export default {
    name: 'FilterEnvelope',
    mixins: [FilterEnvelopeMixin, UIMixin],
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
        this.setFilterAttackListener(this.userSynth, this.attackSlider, this.envelope);
        this.setFilterDecayListener(this.userSynth, this.decaySlider, this.envelope);
        this.setFilterSustainListener(this.userSynth, this.sustainSlider, this.envelope);
        this.setFilterReleaseListener(this.userSynth, this.releaseSlider, this.envelope);

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
            this.envelope = this.createAmpEnvelope("filter-env", envPlotPoints);
            this.setFilterEnvClickListener(this.userSynth, this.envelope, envPlotPoints, initialParams);

            this.attackSlider = this.createEnvelopeSlider("filter-attack-slider", iAttack);
            this.decaySlider = this.createEnvelopeSlider("filter-decay-slider", iDecay);
            this.sustainSlider = this.createEnvelopeSlider("filter-sustain-slider", iSustain);
            this.releaseSlider = this.createEnvelopeSlider("filter-release-slider", iRelease);
            this.attackValue = this.createNumber("filter-attack-value");
            this.decayValue = this.createNumber("filter-decay-value")
            this.sustainValue = this.createNumber("filter-sustain-value");
            this.releaseValue = this.createNumber("filter-release-value")
            this.attackValue.link(this.attackSlider);
            this.decayValue.link(this.decaySlider)
            this.sustainValue.link(this.sustainSlider);
            this.releaseValue.link(this.releaseSlider);
        },
    }

}

</script>