import * as Tone from "tone";

export default {
    data() {
        return {
            defaultNote: "C4",
            defaultDuration: "8n",
            defaultInterval: "4n"
        }
    },
    methods: {
        toggleExample(synth, play, example) {
            play = !play;
            if(play === true) {
                let note = example.note ? example.note : this.defaultNote;
                let duration = example.duration ? example.duration: this.defaultDuration;
                let interval = example.interval ? example.interval: this.defaultInterval;
                this.exampleLoop = new Tone.Loop(function(time) {
                    synth.triggerAttackRelease(note, duration  ,time);
                },interval)
                // Tone exports Transport as a module-level const bound to whichever context
                // existed at import time. main.js swaps in a native AudioContext, so that
                // static Transport belongs to a discarded context - getTransport() returns
                // the live one.
                Tone.getTransport().start();
                this.exampleLoop.start(0);
            } else {
                this.exampleLoop.stop();
                this.exampleLoop.dispose();
            }
            return play;
        }
    }
}