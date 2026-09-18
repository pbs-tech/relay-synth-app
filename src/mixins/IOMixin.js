
export default {
    data() {
        return {
            keyMap: new Map([
                ['Z', 48 ], ['S', 49 ], ['X', 50 ], ['D', 51 ], ['C', 52 ], ['V', 53 ],
                ['G', 54 ], ['B', 55 ], ['H', 56 ], ['N', 57 ], ['J', 58 ], ['M', 59 ],['¼',60],
                ['Q', 60 ], ['2', 61 ], ['W', 62 ], ['3', 63 ], ['E', 64 ], ['R', 65 ],
                ['5', 66 ], ['T', 67 ], ['6', 68 ], ['Y', 69 ], ['7', 70 ], ['U', 71 ],['I',72],
            ]),
            inputMap: new Map(),
        }
    },

    methods: {
        // The computer keyboard only drives the on-screen piano; the piano's own
        // change handler (setClickListener) is the single path that reaches the
        // synth. Previously both fired, so each key press attacked the note twice
        // and, under fast repeats, the attacks and releases desynchronised and
        // leaked voices until the 32 voice limit silenced the synth.
        setKeysDown(synth, piano) {
            window.addEventListener("keydown", e => {
                let key = String.fromCharCode(e.keyCode)
                if (this.keyMap.has(key) && !this.inputMap.has(key)) {
                    let noteValue = this.keyMap.get(key)
                    this.inputMap.set(key, noteValue);
                    piano.toggleKey(noteValue, true);
                }
    
            })
        },
        setKeysUp(synth, piano) {
            window.addEventListener("keyup", e => {
                let key = String.fromCharCode(e.keyCode)
                if (this.inputMap.has(key)) {
                    let noteValue = this.keyMap.get(key)
                    this.inputMap.delete(key);
                    piano.toggleKey(noteValue, false);
                }
            })
        }
    }


}
