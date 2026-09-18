<template>
    <v-container>
        <v-row justify="center" align="center"> 
            <h3 class="text-h6 pa-5"> Filter Settings </h3>
            <v-tooltip location="top">
                <template v-slot:activator="{ props }">
                    <v-btn icon v-bind="props">
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
                    <h4 id="filter-type-title" class="justify-center text-subtitle-2"> Filter Type: </h4> 
                    <v-spacer/>
                    <div id="filter-type-select"></div>
                </v-row>
                <v-row class="py-1 align-center">
                    <h4 id="filter-cutoff-title" class="justify-center text-subtitle-2"> Cutoff (Hz): </h4>
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
import * as Tone from "tone";
import Nexus from "nexusui";
import { computed } from 'vue'
import { useSynthsStore } from '@/stores/useSynthsStore'
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
    props: {
        // See Oscillator: tutorials keep the neutral names, /play does not.
        revealNames: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            neutralFilterTypes: ["No Filter", "Filter Type 1", "Filter Type 2", "Filter Type 3"],
            realFilterTypes: ["No Filter", "Bandpass", "Lowpass", "Highpass"],
            FILTER_MAX: 20000,
            INITIAL_CUTOFF: 5000,
        }
    },

    computed: {
        filterTypes() {
            return this.revealNames ? this.realFilterTypes : this.neutralFilterTypes;
        },
        filterLabelMap() {
            return this.filterTypes.reduce((map, label, i) => {
                map[label] = this.neutralFilterTypes[i];
                return map;
            }, {});
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
            this.setFilterType(this.userSynth, this.selectFilterType, this.envelope, this.filterLabelMap);
            // Previously missing. createFilterCutoffSlider and setFilterCutoffListener
            // both existed but were never called, so the cutoff was permanently
            // whatever setFilterClickListener applied on mount and no tutorial could
            // ask for any other value.
            this.setFilterCutoffListener(this.userSynth, this.cutoffSlider, this.envelope);
    

        });

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
    unmounted() {
        if (this.cutoffSlider) this.cutoffSlider.destroy();
        if (this.cutoffValue) this.cutoffValue.destroy();
        if (this.selectFilterType) this.selectFilterType.destroy();
        if (this.envelope) this.envelope.destroy();
    }
}

</script>
