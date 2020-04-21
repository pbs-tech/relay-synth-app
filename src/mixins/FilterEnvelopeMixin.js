export default {
    methods: {
        setFilterAttackListener(synth, slider, envelope) {
            slider.on('change', function(v) {
                v = Math.floor(v * 100) / 100;
                envelope.movePoint(1, v, 1);
                synth.set({
                    filterEnvelope: {
                        attack: v
                    }
                })
            })
        },

        setFilterDecayListener(synth, slider, envelope) {
            slider.on('change', function(v) {
                if (v === 0) {
                    v = 0.01
                } else {
                    v = Math.floor(v * 100) / 100;
                }
                let y = envelope.points[2].y
                envelope.movePoint(2, v, y);
                synth.set({
                    filterEnvelope: {
                        decay: v
                    }
                })
            })
        },
        setFilterSustainListener(synth, slider, envelope) {
            slider.on('change', function(v) {
                v = Math.floor(v * 100) / 100;
                let x = envelope.points[2].x;
                envelope.movePoint(2, x, v);
                synth.set({
                    filterEnvelope: {
                        sustain: v
                    }
                })
            })
        },
        setFilterReleaseListener(synth, slider, envelope) {
            slider.on('change', function(v) {
                if (v === 0) {
                    v = 0.01
                } else {
                    v = Math.floor(v * 100) / 100;
                }
                envelope.movePoint(3, v, 0);
                synth.set({
                    filterEnvelope: {
                        release: v
                    }
                })
            })
        },
        setFilterEnvClickListener(synth, envelope, initialPoints, initialParams) {
            envelope.on('click', function() {
                envelope.setPoints(initialPoints);
            })
            synth.set({
                filterEnvelope: {
                    attack: initialParams.iAttack,
                    decay: initialParams.iDecay,
                    sustain: initialParams.iSustain,
                    release: initialParams.iRelease
                }
            })
        }
    }
}