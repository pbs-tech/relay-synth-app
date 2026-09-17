import Nexus from "nexusui";

export default {

    data() {
        return {
            pianoDefault: {
                'size': [512,128],
                'lowNote': 48,
                'highNote': 72
            },
            oscDefault: {
                'size' : [512,128]
            },
            envDefault: [
                {
                    x: 0,
                    y: 0
                },
                {
                    x: 0.0,
                    y: 1.0
                },
                {
                    x: 0.65,
                    y: 0.2
                },
                {
                    x:1.0,
                    y:0.0
                }
            ],
            filterDefault: [
                {
                    x: 0,
                    y: 0
                },
                {
                    x: 2.0,
                    y: 0.8
                },
                {
                    x:1.0,
                    y:0.8
                }
            ]
        }
    },
    methods: {
        createPiano(name, params) {
            return Nexus.Add.Piano(name, 
                params ? params : this.pianoDefault);
        },
        
        createOsc(name, params) {
            return Nexus.Add.Oscilloscope(name, 
                params ? params : this.oscDefault);
        },
        createSelect(name, options) {
            return Nexus.Add.Select(name, {
                'size': [500,40],
                'options': options
            })
        },
        createVolumeSlider(name) { 
            return  Nexus.Add.Slider(name, {
                'size': [512,40],
                'mode': 'absolute',
                'min': -60,
                'max': 1,
                'increment': .1,
                'value': -20
            })
        },
        createNumber(name) {
            return Nexus.Add.Number(name);
        },
        // step 0.05 gives 21 positions across the range. It was 0.25, which left
        // only 5 reachable values per stage and made every envelope tutorial a
        // guess between a handful of options.
        createEnvelopeSlider(name, initialValue) {
            return Nexus.Add.Slider(name, {
                'size': [400,40],
                'mode': 'absolute',
                'min': 0,
                'max': 1,
                'step': 0.05,
                'value': initialValue
            })
        },
        createAmpEnvelope(name, initialPoints) {
            return Nexus.Add.Envelope(name, {
                'size': [450,200],
                'noNewPoints': true,
                'points': initialPoints ? initialPoints : this.envDefault
            })
        },
        createFilterEnvelope(name, initialPoints) {
            return Nexus.Add.Envelope(name, {
                'size': [450,200],
                'noNewPoints': true,
                'points': initialPoints ? initialPoints : this.filterDefault
            })
        },
        createFilterCutoffSlider(name, initialValue) {
            return Nexus.Add.Slider(name, {
                'size': [400,40],
                'mode': 'absolute',
                'min': 1000,
                'max': 20000,
                'step': 1000,
                'value': initialValue
            })
        }
    }
}