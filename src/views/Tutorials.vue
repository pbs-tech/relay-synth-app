<template>
    <v-container class="my-5">
        <h1 class="display-3 ma-2 secondary--text">Tutorials</h1>
        <v-container class="body-1 ma-5">
			<p> These tutorials aim to teach the fundamental parts of a synthesizer (synth) using interactive tutorials. 
			To complete the tutorials you must replicate the sound using the controls presented. You can listen to your own synth
			and the tutorial synth by clicking the play buttons or by clicking on a note on the pianos.
			</p>
			<p class="font-weight-bold"> You can also play your own synth using your computer keyboard. 
				Using z to , for lower pitch white notes starting from C3 and s,d,g,h,j for lower pitch black notes and 
				q to o for the higher pitch white notes starting from C5 and 2,3,5,6,7 for high pitch black notes.  </p>
		</v-container>
        <TutorialList v-bind:tutorials="tutorialTitles"/>
    </v-container>
</template>

<script>
import TutorialList from '@/components/tutorial/list/TutorialList';
import { mapGetters, mapActions } from 'vuex';

export default {
    name: 'Tutorials',
    components: {
        TutorialList
    },
    methods: {
      ...mapActions(['fetchTitles'])
    },
    computed: mapGetters(['tutorialTitles']),
    created() {
      this.fetchTitles();
    }
}
</script>