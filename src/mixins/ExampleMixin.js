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
                this.stopExample();
                // The stop button is what anyone reaches for when a note is
                // stuck, so silence whatever is still held, not just the loop.
                if (this.releaseHeldNotes) {
                    this.releaseHeldNotes();
                } else if (synth && !synth.disposed) {
                    synth.releaseAll();
                }
            }
            return play;
        },

        // Guarded because the button can be clicked before a loop exists, and
        // teardown calls this whether or not one was ever started.
        stopExample() {
            if (!this.exampleLoop) {
                return;
            }
            this.exampleLoop.stop();
            this.exampleLoop.dispose();
            this.exampleLoop = null;
        }
    }
}