export default {

    data() {
        return {
            FILTER_MAX: 20000
        }
    },
    methods:  {
        setFilterType(synth, select, envelope, labelMap) {
            select.on('change', function(v) {
                // See setOscillator: /play shows real filter names, tutorials
                // keep the neutral ones.
                const choice = (labelMap && labelMap[v.value]) || v.value;
                // Declared per event. It used to live in setFilterType's scope,
                // so it survived between changes and 'No Filter' - which never
                // assigned it - reapplied whichever type was picked last.
                let filterType;
                switch (choice) {
                    case 'Filter Type 1': {
                        // 'No Filter' empties the envelope, so these reads are
                        // not guaranteed a point. They used to be unguarded and
                        // threw on the way back out of 'No Filter'; the type
                        // still applies, there is just no curve to rebuild.
                        if (envelope.points.length >= 2) {
                            let bp1 = envelope.points[0];
                            let bp2 = envelope.points[1];
                            let bp3 = {x: 0.5 + (bp2.x / 2) , y: bp2.y }
                            let bp4 = {x: 0.5 + (bp1.x / 2) , y: bp1.y }
                            // Both inner branches set the same four points, and
                            // so did the highpass and lowpass blocks, so the
                            // guards never changed the outcome - one could not
                            // even be true, comparing bp2.y against itself.
                            // What ordering the author meant to pick in the
                            // other case is not recoverable from the code, so
                            // this keeps the behaviour exactly as it shipped
                            // rather than guessing at a curve nobody can check.
                            const currentType = synth.get().filter.type;
                            if (currentType === 'highpass' || currentType === 'lowpass') {
                                envelope.setPoints([bp2, bp1, bp4, bp3])
                            }
                        }
                        filterType = "bandpass"
                        break;
                    }
                    case 'Filter Type 2': {
                        if (envelope.points.length >= 2) {
                            let lp1 = envelope.points[0];
                            let lp2 = envelope.points[1];
                            envelope.setPoints([lp2, lp1]);
                        }
                        filterType = "lowpass"
                        break;
                    }
                    case 'Filter Type 3': {
                        if (envelope.points.length >= 2) {
                            let hp1 = envelope.points[0];
                            let hp2 = envelope.points[1];
                            envelope.setPoints([hp2, hp1]);
                        }
                        filterType = 'highpass'
                        break;
                    }
                    case 'No Filter':
                        // Tone's filter has no "off": Filter's type setter
                        // asserts against a fixed list, so leaving this unset
                        // threw `Invalid filter type: undefined` the first time
                        // 'No Filter' was chosen, and silently reapplied the
                        // previous filter every time after. allpass is the
                        // member of that list that passes every frequency.
                        envelope.setPoints([]);
                        filterType = 'allpass';
                        break;
                    default:
                        // Nothing recognisable to apply; leave the synth alone
                        // rather than sending it an undefined type.
                        return;
                } 
                synth.set({
                    filter: {
                        type: filterType
                    }
                })
            })
        },
        setFilterCutoffListener(synth, slider, envelope) {
            let filterMax = this.FILTER_MAX;
            slider.on('change', function(v) {
                v = Math.round(v * 100) / 100;
                if(synth.get().filter.type === 'bandpass' && envelope.points.length >= 4) {
                    let y0 = envelope.points[0].y;
                    let y1 = envelope.points[1].y;
                    let y2 = envelope.points[2].y;
                    let y3 = envelope.points[3].y;
                    envelope.movePoint(0,0.5 - v / (filterMax * 2), y0);
                    envelope.movePoint(1,0.5 - v / (filterMax * 2), y1);
                    envelope.movePoint(2,0.5 + v / (filterMax * 2), y2);
                    envelope.movePoint(3,0.5 + v / (filterMax * 2), y3);
                }
                // Guarded for the same reason as setFilterType: under
                // 'No Filter' the envelope holds no points, and these reads
                // threw. The cutoff still reaches the synth below.
                else if (envelope.points.length >= 2) {
                    let y0 = envelope.points[0].y;
                    let y1 = envelope.points[1].y;
                    envelope.movePoint(0,v /filterMax, y0);
                    envelope.movePoint(1,v /filterMax, y1);
                }
                synth.set({
                    filter: {
                        frequency: v
                    }
                })
            })
        },
        setFilterClickListener(synth, envelope, initialPoints, initialValue) {
            envelope.on('click', function() {
                envelope.setPoints(initialPoints);
            })
            synth.set({
                filter: {
                    frequency: initialValue
                }
            })
        } 
    }
}