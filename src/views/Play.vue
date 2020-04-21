<template>
    <v-container justify="center" align="center">
        <h1 class="display-3 py-5 text--text">Play</h1>
        <v-row justify="center" align="center" class="body-1 pa-5"> This page allows you to create sounds outside of a tutorial,
             feel free to experiment. More controls will be added as they are implemented. 
             You can play the synth by clicking the notes on the piano or by using the letters on your keyboard:
             <v-list>
             <v-list-item class="body-1 text--text font-weight-bold"> z to , for lower pitch white notes and s,d,g,h,j for lower pitch black notes. </v-list-item>
             <v-list-item class="body-1 text--text font-weight-bold"> q to o for the higher pitch notes snd 2,3,5,6,7 for high pitch black notes. </v-list-item>
             </v-list>
             </v-row>
        <v-row>
            <v-col justify="center" align="center">
                <UserSynth/>
                <Oscillator/>
                <AmplitudeEnvelope/>
                <FilterSettings/>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import Tone from "tone";
import Nexus from "nexusui";
import UserSynth from "@/components/synth/UserSynth";
import Oscillator from "@/components/synth/Oscillator";
import AmplitudeEnvelope from "@/components/synth/AmplitudeEnvelope";
import FilterSettings from "@/components/synth/FilterSettings";


export default {
    name: 'Play',
    components: {
        UserSynth,
        Oscillator,
        AmplitudeEnvelope,
        FilterSettings
    },
    created() {
        Nexus.colors.accent = this.$vuetify.theme.themes.light.primary;    
    }
}
</script>