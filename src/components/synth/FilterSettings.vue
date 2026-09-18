<template>
    <v-container>
        <v-row justify="center" align="center"> 
            <h3 class="title pa-5"> Filter Settings </h3>
            <v-tooltip top>
                <template v-slot:activator="{ on }">
                    <v-btn icon v-on="on">
                        <v-icon color="secondary">mdi-help-circle</v-icon>
                    </v-btn>
                </template>
                <span> This controls the filter type and its cutoff value </span>
            </v-tooltip>
        </v-row>
        <v-row no-gutters>
            <v-col justify="center" align="center">
                <div id="user-filter-env"></div>
            </v-col>
            <v-col>
                <v-row class="py-1 align-center">
                    <h4 id="filter-type-title" class="justify-center subtitle-2"> Filter Type: </h4> 
                    <v-spacer/>
                    <div id="filter-type-select"></div>
                </v-row>
                <v-row class="py-1 align-center">
                    <h4 id="filter-cutoff-title" class="justify-center subtitle-2"> Cutoff (Hz): </h4>
                    <v-spacer/>
                    <div id="filter-cutoff-slider"></div>
                    <v-spacer/>
                    <div id="filter-cutoff-value"></div>
                </v-row>
            </v-col>
        </v-row>
    </v-container>
</template>
<script>
import Tone from "tone";
import Nexus from "nexusui";
import { computed } from 'vue'
import { useSynthsStore } from '@/stores/useSynthsStore'
import {mapGetters } from 'vuex';
import EnvelopeMixin from '@/mixins/EnvelopeMixin';
import FilterMixin from '@/mixins/FilterMixin';
import UIMixin from '@/mixins/UIMixin';

export default {
    name: 'FilterSettings',
    mixins: [FilterMixin, EnvelopeMixin, UIMixin],
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
            filterTypes: ["No Filter", "Filter Type 1", "Filter Type 2", "Filter Type 3"],
            FILTER_MAX: 20000,
            INITIAL_CUTOFF: 5000,
        }
    },

    created() {
       Nexus.context = Tone.context;
    },

    mounted() {
        this.initUi();
        this.setFilterType(this.userSynth, this.selectFilterType, this.envelope);
        // Previously missing. createFilterCutoffSlider and setFilterCutoffListener
        // both existed but were never called, so the cutoff was permanently
        // whatever setFilterClickListener applied on mount and no tutorial could
        // ask for any other value.
        this.setFilterCutoffListener(this.userSynth, this.cutoffSlider, this.envelope);
    },
    methods: {
        initUi() {
            let initialCutoffValue = this.INITIAL_CUTOFF;
            let filterPlotPoint  = [{x: initialCutoffValue / this.FILTER_MAX, y: 0.65}, {x: initialCutoffValue / this.FILTER_MAX, y: 0.01} ]; 

            this.envelope = this.createFilterEnvelope("user-filter-env", filterPlotPoint);
            this.setFilterClickListener(this.userSynth, this.envelope, filterPlotPoint, initialCutoffValue);
            this.selectFilterType = this.createSelect("filter-type-select", this.filterTypes);

            this.cutoffSlider = this.createFilterCutoffSlider("filter-cutoff-slider", initialCutoffValue);
            this.cutoffValue = this.createNumber("filter-cutoff-value");
            this.cutoffValue.link(this.cutoffSlider);
        }
    },
    destroyed() {
        if (this.cutoffSlider) this.cutoffSlider.destroy();
        if (this.cutoffValue) this.cutoffValue.destroy();
        if (this.selectFilterType) this.selectFilterType.destroy();
        if (this.envelope) this.envelope.destroy();
    }
}

</script>
