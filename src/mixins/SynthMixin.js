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
            piano.on('change',function(key) {
                if(key.state) {
                    synth.triggerAttack(Nexus.mtof(key.note));
                } else {
                    synth.triggerRelease();
                }
            })
        },
        setVolumeChangeListener(synth, slider) {
            slider.on('change', function(v) {
                synth.volume.value = v;
            })
        },
        
        setOscillator(synth, select) {
            let waveform;
            select.on('change', function(v) {
                switch (v.value) {
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