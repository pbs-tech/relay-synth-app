import Tone from "tone";

export default {
    methods: {
        toggleExample(synth, play, example) {
            play = !play;
            if(play === true) {
                this.exampleLoop = new Tone.Loop(function(time) {
                    synth.triggerAttackRelease(example.note, example.duration ,time);
                },example.interval)
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