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
import FilterMixin from '@/mixins/FilterMixin';
import UIMixin from '@/mixins/UIMixin';

export default {
    name: 'FilterSettings',
    mixins: [FilterMixin, EnvelopeMixin, UIMixin],
    data() {
        return {
            filterTypes: ["No Filter", "Filter Type 1", "Filter Type 2", "Filter Type 3"],
            FILTER_MAX: 20000,
        }
    },

    created() {
       Nexus.context = Tone.context;
    },
    computed: mapGetters(['userSynthData','userSynth']),

    mounted() {
        this.initUi();
        this.setFilterType(this.userSynth, this.selectFilterType, this.envelope);
    },
    methods: {
        initUi() {
            let initialCutoffValue = 5000;
            let filterPlotPoint  = [{x: initialCutoffValue / this.FILTER_MAX, y: 0.65}, {x: initialCutoffValue / this.FILTER_MAX, y: 0.01} ]; 

            this.envelope = this.createFilterEnvelope("user-filter-env", filterPlotPoint);
            this.setFilterClickListener(this.userSynth, this.envelope, filterPlotPoint, initialCutoffValue);
            this.selectFilterType = this.createSelect("filter-type-select", this.filterTypes);
        
        }
    }
}

</script>