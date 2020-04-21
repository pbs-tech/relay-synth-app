export default {

    data() {
        return {
            FILTER_MAX: 20000
        }
    },
    methods:  {
        setFilterType(synth, select, envelope) {
            let filterType;
            select.on('change', function(v) {
                switch (v.value) {
                    case 'Filter Type 1':
                        let bp1 = envelope.points[0];
                        let bp2 = envelope.points[1];
                        let bp3 = {x: 0.5 + (bp2.x / 2) , y: bp2.y }
                        let bp4 = {x: 0.5 + (bp1.x / 2) , y: bp1.y }
                        if (synth.get().filter.type === 'highpass') {
                            if(bp1.y < bp2.y && bp3.y < bp4.y) {
                                envelope.setPoints([bp2,bp1,bp4,bp3])
                            } else {
                                envelope.setPoints([bp2,bp1,bp4,bp3])
                            }
                        }
                        if (synth.get().filter.type === 'lowpass') {
                            if(bp2.y > bp2.y && bp3.y > bp4.y) {
                                envelope.setPoints([bp2,bp1,bp4,bp3])
                            } else {
                                envelope.setPoints([bp2,bp1,bp4,bp3]) 
                            }
                        }
                        filterType = "bandpass"
                        break;
                    case 'Filter Type 2':
                        let lp1 = envelope.points[0];
                        let lp2 = envelope.points[1];
                        envelope.setPoints([lp2, lp1]);
                        filterType = "lowpass"
                        break;
                    case 'Filter Type 3':
                        let hp1 = envelope.points[0];
                        let hp2 = envelope.points[1];
                        envelope.setPoints([hp2, hp1]);
                        filterType = 'highpass'
                        break;
                    case 'No Filter': 
                        envelope.setPoints([]);
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
                v = Math.floor(v * 100) / 100;
                if(synth.get().filter.type === 'bandpass') {
                    let y0 = envelope.points[0].y;
                    let y1 = envelope.points[1].y;
                    let y2 = envelope.points[2].y;
                    let y3 = envelope.points[3].y;
                    envelope.movePoint(0,0.5 - v / (filterMax * 2), y0);
                    envelope.movePoint(1,0.5 - v / (filterMax * 2), y1);
                    envelope.movePoint(2,0.5 + v / (filterMax * 2), y2);
                    envelope.movePoint(3,0.5 + v / (filterMax * 2), y3);
                }
                else {
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