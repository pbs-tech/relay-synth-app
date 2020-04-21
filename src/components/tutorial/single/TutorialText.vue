<template>
    <v-container>
        <div id="header" class="my-2 secondary--text" >
            <v-row>
                <h1 class="display-3  py-2"> 
                    Tutorial {{ tutorial.number }}: {{ tutorial.name }}
                </h1>
                <v-spacer/>
                <v-tooltip top>
                    <template v-slot:activator="{ on }">
                        <v-btn  large icon v-on="on">
                            <v-icon color="secondary">mdi-help-circle</v-icon>
                        </v-btn>
                    </template>
                    <span class="body-2"> Try and re-create the tutorial sound by changing the parameters at the bottom. Press the send button to submit your answer.</span>
                </v-tooltip>
            </v-row>
            <div class="mx-6">

                <h2 class="headline">
                    Category: {{ tutorial.category }}  
                </h2>

                <h2 class ="headline">
                    Difficulty: {{ tutorial.difficulty }}
                </h2>

                <h2 class ="headline">
                    Points Available: 
                        <span v-if="!tutorialComplete"> {{ tutorial.pointsAvailable }} </span>
                        <span v-else> 0 </span>
                </h2>     
                <h2 v-if="tutorialComplete" class="headline font-weight-bold green--text">
                    Completed
                </h2>
            </div>
        </div>
        <v-divider/>
        <div id="text" class="pa-8 mx-auto body-1"> 
            {{ tutorial.text }} 
        </div>
    </v-container>
</template>
<script>

import { mapGetters, mapActions } from 'vuex';

export default {
    name:'TutorialText',
    props: {
        tutorialId: String,
    },
    created() {
        this.fetchTutorialText(this.tutorialId);
        this.isTutorialComplete(this.tutorialId)
    },
    computed: mapGetters(['tutorialComplete', 'tutorial']),

    methods: {
        ...mapActions(['fetchTutorialText', "isTutorialComplete"])
    },
}
</script>