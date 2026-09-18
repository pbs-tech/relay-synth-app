<template>
    <div id="user-synth" class="mx-auto">
        <div id="user-osc"></div>
        <div id="user-piano"></div>
        <div>
            <v-btn
                v-model="playButton"
                id="user-play-button"
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
            <h3 class="text-h6 text-dark pa-5"> User Volume </h3> 
             <v-tooltip location="top" v-model="show">
                <template v-slot:activator="{ props }">
                    <v-btn icon variant="text" v-bind="props">
                        <v-icon color="secondary">mdi-help-circle</v-icon>
                    </v-btn>
                </template>
                <span class="text-body-2"> Changes the volume of your synth </span>
                </v-tooltip>
            </v-row>
            <div id="user-volume-slider"></div>
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
import IOMixin from '@/mixins/IOMixin';

export default {
    name: 'TutorialSynth',
    props: {
        tutorialId: String
    },
    mixins: [SynthMixin, ExampleMixin, UIMixin, IOMixin],
    setup() {
        const synthsStore = useSynthsStore()
        const exampleStore = useExampleStore()

        const userSynth = computed(() => synthsStore.userSynth)
        const tutorialSynth = computed(() => synthsStore.tutorialSynth)
        const example = computed(() => exampleStore.example)

        const fetchExample = (tutorialId) => {
            return exampleStore.fetchExample(tutorialId)
        }

        const fetchSynthBase = (tutorialId) => {
            return synthsStore.fetchSynthBase(tutorialId)
        }

        const setUserSynth = () => {
            synthsStore.setUserSynth()
        }

        return {
            userSynth,
            tutorialSynth,
            example,
            fetchExample,
            fetchSynthBase,
            setUserSynth
        }
    },
    data() {
        return {
            playButton: false,
            show: false
        }
    },

    mounted() {
        // Nexus resolves its mount points with document.getElementById, and
        // mounted() does not guarantee this subtree is in the document yet -
        // under a lazily routed view in Vue 3 it is not, so the lookup returned
        // nothing and Nexus threw before any control was built. Defer a tick.

        this.$nextTick(() => {
            this.initUi();
            this.fetchExample(this.tutorialId);
            this.setUserSynth();
            this.setOscListener(this.userSynth, this.oscilloscope);
            this.setClickListener(this.userSynth, this.piano);
            this.setVolumeChangeListener(this.userSynth, this.volumeSlider);
            this.setKeysDown(this.userSynth, this.piano);
            this.setKeysUp(this.userSynth, this.piano);

    

        });

    },
    methods: {
        initUi() {
            this.piano = this.createPiano("user-piano");
            this.oscilloscope = this.createOsc("user-osc");
            this.volumeSlider =  this.createVolumeSlider("user-volume-slider");
        },
        onExampleClick() {
            this.playButton = this.toggleExample(this.userSynth, this.playButton, this.example);
        }
    },     
    unmounted() {
        // volumeNumber was never assigned by initUi, so destroying it threw and
        // everything after it - including piano.destroy() - was skipped.
        // Disposing the synth here is also wrong: the store owns it, and by the
        // time this runs the next route component has already replaced it.
        this.teardownKeyboard();
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