import Nexus from "nexusui";
export default  {
    data() {
        return {
            FILTER_MAX: 20000
        }
    },
    methods:  {
        setOscListener(synth, osc) {  
            osc.connect(synth);
        },
        setClickListener(synth, piano) {
            // Tone 14's PolySynth releases only the first voice it finds for a
            // note, so a note attacked twice keeps a voice sounding forever -
            // the drone. A repeat 'on' is easy to reach: the key map produces
            // note 60 from two different keys, and dragging back onto a piano
            // key re-fires it. Track what is sounding so each note gets exactly
            // one attack and one release.
            const sounding = new Set();

            piano.on('change', function(key) {
                const frequency = Nexus.mtof(key.note);
                if (key.state) {
                    if (sounding.has(key.note)) {
                        return;
                    }
                    sounding.add(key.note);
                    synth.triggerAttack(frequency);
                } else if (sounding.delete(key.note)) {
                    // Tone 13 released every voice when called with no note;
                    // Tone 14 ignores that, so the note has to be named.
                    synth.triggerRelease(frequency);
                }
            })

            // Releasing the mouse outside the piano, or losing focus mid-note,
            // means the matching 'off' never arrives. Drop everything rather
            // than leave it droning.
            this.blurHandler = function() {
                sounding.clear();
                if (synth && !synth.disposed) {
                    synth.releaseAll();
                }
            }
            window.addEventListener('blur', this.blurHandler)

            // Lets the component silence held notes without knowing how they
            // are tracked - used on teardown and by the stop button.
            this.releaseHeldNotes = this.blurHandler
        },

        teardownClickListener() {
            if (this.blurHandler) {
                window.removeEventListener('blur', this.blurHandler)
                this.blurHandler = null
            }
        },
        setVolumeChangeListener(synth, slider) {
            slider.on('change', function(v) {
                synth.volume.value = v;
            })
        },
        
        setOscillator(synth, select, labelMap) {
            let waveform;
            select.on('change', function(v) {
                // /play names the waveforms outright while tutorials keep the
                // neutral labels, so map the shown label back to the canonical
                // one before deciding.
                const choice = (labelMap && labelMap[v.value]) || v.value;
                switch (choice) {
                    case 'Waveform 1':
                        waveform = "triangle";
                        break;
                    case 'Waveform 2':
                        waveform = "sine";
                        break;
                    case 'Waveform 3':
                        waveform = "sawtooth";
                        break;
                    case 'Waveform 4':
                        waveform = "square";
                        break;
                    default:
                        waveform = "triangle";
                        break;
                }
                synth.set({
                    oscillator: {
                        type: waveform
                    },
                })
            })
        },
    }

}