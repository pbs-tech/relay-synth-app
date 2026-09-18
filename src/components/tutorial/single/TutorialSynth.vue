<template>
    <div id="tutorial-synth" class="mx-auto">
        <div id="tutorial-osc"></div>
        <div id="tutorial-piano"></div>
        <div>
            <v-btn
            id="tutorial-play-button"
            v-model="playButton"
            icon
           
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
                <h3 class="text-h6 text-dark pa-5"> Example Volume </h3> 
                    <v-tooltip location="top">
                    <template v-slot:activator="{ props }">
                        <v-btn icon variant="text" v-bind="props">
                            <v-icon color="secondary">mdi-help-circle</v-icon>
                        </v-btn>
                    </template>
                    <span class="text-body-2"> Changes the volume of the tutorial synth </span>
                    </v-tooltip>
            </v-row>
            <div id="tutorial-volume-slider"></div>
        </div>                                   
    </div>
</template>
<script>
import { computed } from 'vue'
import { useSynthsStore } from '@/stores/useSynthsStore'
import { useExampleStore } from '@/stores/useExampleStore'
import SynthMixin from '@/mixins/SynthMixin';
import ExampleMixin from '@/mixins/ExampleMixin';
import UIMixin from '@/mixins/UIMixin';

export default {
    name: 'TutorialSynth',
    props: {
        tutorialId: String
    },
    mixins: [SynthMixin, ExampleMixin, UIMixin],
    setup() {
        const synthsStore = useSynthsStore()
        const exampleStore = useExampleStore()

        const tutorialSynthData = computed(() => synthsStore.tutorialSynthData)
        const tutorialSynth = computed(() => synthsStore.tutorialSynth)
        const example = computed(() => exampleStore.example)

        const fetchTutorialSynthData = (tutorialId) => {
            return synthsStore.fetchTutorialSynthData(tutorialId)
        }

        const fetchExample = (tutorialId) => {
            return exampleStore.fetchExample(tutorialId)
        }

        return {
            tutorialSynthData,
            tutorialSynth,
            example,
            fetchTutorialSynthData,
            fetchExample
        }
    },
    data() {
        return {
            playButton: false,
        }
    },

    mounted() {
        // Nexus resolves its mount points with document.getElementById, and
        // mounted() does not guarantee this subtree is in the document yet -
        // under a lazily routed view in Vue 3 it is not, so the lookup returned
        // nothing and Nexus threw before any control was built. Defer a tick.

        this.$nextTick(() => {
            this.initUi();
            this.fetchTutorialSynthData(this.tutorialId).then(() => {
                this.setOscListener(this.tutorialSynth, this.oscilloscope);
                this.setClickListener(this.tutorialSynth, this.piano);
                this.setVolumeChangeListener(this.tutorialSynth, this.volumeSlider);
            })
    

        });

    },
    methods: {
        initUi() {
            this.piano = this.createPiano("tutorial-piano");
            this.oscilloscope = this.createOsc("tutorial-osc");
            this.volumeSlider =  this.createVolumeSlider("tutorial-volume-slider");
        },
        onExampleClick() {
            this.playButton = this.toggleExample(this.tutorialSynth, this.playButton, this.example);
        }
    },
    unmounted() {
        // See UserSynth: volumeNumber is never assigned, and destroying it threw
        // before the piano was ever torn down.
        this.teardownClickListener();
        if (this.releaseHeldNotes) {
            this.releaseHeldNotes();
        }
        // Deliberately not touching the Transport. It is global and shared, and
        // cancelling it strands voices: a note played after a cancel never gets
        // its onsilence callback, so it is never returned to the pool and
        // activeVoices climbs until maxPolyphony silences the synth. Measured:
        // a note leaves 0 active voices normally and 1 after a Transport
        // cancel+stop. stopExample() already disposes the only thing this
        // component schedules.
        this.stopExample();
        if (this.oscilloscope) this.oscilloscope.destroy();
        if (this.volumeSlider) this.volumeSlider.destroy();
        if (this.piano) this.piano.destroy();
    }  
}
</script>