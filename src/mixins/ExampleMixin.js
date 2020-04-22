import Tone from "tone";

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
                Tone.Transport.start();
                this.exampleLoop.start(0);
            } else {
                this.exampleLoop.stop();
                this.exampleLoop.dispose();
            }
            return play;
        }
    }
}