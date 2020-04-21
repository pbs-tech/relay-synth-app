export default {

    methods:  {
    
        setEnvAttackListener(synth, slider, envelope) {
            slider.on('change', function(v) {
                v = Math.floor(v * 100) / 100;
                envelope.movePoint(1, v, 1);
                synth.set({
                    envelope: {
                        attack: v
                    }
                })
            })
        },
        setEnvDecayListener(synth, slider, envelope) {
            slider.on('change', function(v) {
                if (v === 0) {
                    v = 0.01
                } else {
                    v = Math.floor(v * 100) / 100;
                }
                let y = envelope.points[2].y
                envelope.movePoint(2, v, y);
                synth.set({
                    envelope: {
                        decay: v
                    }
                })
            })
        },
        setEnvSustainListener(synth, slider, envelope) {
            slider.on('change', function(v) {
                v = Math.floor(v * 100) / 100;
                let x = envelope.points[2].x;
                envelope.movePoint(2, x, v);
                synth.set({
                    envelope: {
                        sustain: v
                    }
                })
            })
        },
        setEnvReleaseListener(synth, slider, envelope) {
            slider.on('change', function(v) {
                if (v === 0) {
                    v = 0.01
                } else {
                    v = Math.floor(v * 100) / 100;
                }
                envelope.movePoint(3, v, 0);
                synth.set({
                    envelope: {
                        release: v
                    }
                })
            })
        },
        setEnvClickListener(synth, envelope, initialPoints, initialParams) {
            envelope.on('click', function() {
                envelope.setPoints(initialPoints);
            })
            synth.set({
                envelope: {
                    attack: initialParams.iAttack,
                    decay: initialParams.iDecay,
                    sustain: initialParams.iSustain,
                    release: initialParams.iRelease,
                }
            })
        }, 
    }
}