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

        // NexusUI decides its entire input model from one line evaluated when the
        // module is first imported:
        //
        //     exports.exists = ('ontouchstart' in document.documentElement)
        //
        // PianoKey.buildInterface() then puts *every* mouse handler behind
        // `if (!touch.exists)`, and Piano.buildInterface() stubs the key
        // handlers outright and installs touch listeners instead. So any
        // machine that merely reports touch support - a Linux box with a
        // touchscreen, and then every browser on it - gets a piano with no
        // mouse handling whatsoever: the click lands on the key, nothing
        // happens, and nothing is thrown. Measured on one build: a press that
        // produces audio with ontouchstart absent produces silence with it
        // present, same coordinates, no page error.
        //
        // Pointer events cover mouse, touch and pen through one path, so drive
        // the keys from those and route through piano.toggleKey() - which is
        // what the computer keyboard already uses, and which works whatever
        // Nexus decided about the device.
        setPointerListener(piano) {
            const element = piano.element;

            // Stop Nexus acting on the same gestures. Its per-key handlers are
            // plain properties and can be replaced; its touch listeners are
            // closures bound to piano.element and cannot be removed, so those
            // events are stopped one level up, in the capture phase, before
            // they ever reach it.
            const ignore = () => {};
            piano.keys.forEach(key => {
                key.preClick = key.preMove = key.preRelease = ignore;
                key.click = key.move = key.release = ignore;
                key.preTouch = key.preTouchMove = key.preTouchRelease = ignore;
                key.touch = key.touchMove = key.touchRelease = ignore;
            });

            this.nexusTouchBlocker = e => e.stopPropagation();
            this.nexusTouchTarget = element.parentNode;
            if (this.nexusTouchTarget) {
                ['touchstart', 'touchmove', 'touchend'].forEach(type =>
                    this.nexusTouchTarget.addEventListener(type, this.nexusTouchBlocker, true))
            }

            // Dragging across the keys is a glissando, not a scroll or a text
            // selection - and a scroll would cancel the pointer stream and
            // strand the note that was sounding.
            element.style.touchAction = 'none';

            // Black keys sit above white ones, so the topmost element at the
            // point is the key that was actually hit.
            const noteAt = (x, y) => {
                const target = document.elementFromPoint(x, y);
                if (!target) return null;
                const key = piano.keys.find(k => k.pad === target);
                return key ? key.note : null;
            };

            const active = new Set();
            const sounding = new Map();

            // One pointer sounds at most one note, so moving onto a new key
            // releases the old one - that is the glissando.
            const moveTo = (pointerId, note) => {
                const current = sounding.has(pointerId) ? sounding.get(pointerId) : null;
                if (current === note) return;
                if (current !== null) {
                    sounding.delete(pointerId);
                    piano.toggleKey(current, false);
                }
                if (note !== null) {
                    sounding.set(pointerId, note);
                    piano.toggleKey(note, true);
                }
            };

            this.pointerDownHandler = e => {
                const note = noteAt(e.clientX, e.clientY);
                if (note === null) return;
                e.preventDefault();
                // Keeps move and up coming even once the pointer leaves the
                // piano, so a drag off the edge still releases its note.
                try {
                    element.setPointerCapture(e.pointerId);
                } catch (err) {
                    // Not fatal: without capture a pointer that leaves the
                    // element is handled by the pointercancel/blur paths.
                }
                active.add(e.pointerId);
                moveTo(e.pointerId, note);
            };

            this.pointerMoveHandler = e => {
                if (!active.has(e.pointerId)) return;
                moveTo(e.pointerId, noteAt(e.clientX, e.clientY));
            };

            this.pointerUpHandler = e => {
                if (!active.has(e.pointerId)) return;
                moveTo(e.pointerId, null);
                active.delete(e.pointerId);
            };

            // Losing focus mid-press means the matching pointerup never
            // arrives, which would leave the key lit and the note sounding.
            this.pointerBlurHandler = () => {
                Array.from(active).forEach(pointerId => {
                    moveTo(pointerId, null);
                    active.delete(pointerId);
                });
            };

            element.addEventListener('pointerdown', this.pointerDownHandler);
            element.addEventListener('pointermove', this.pointerMoveHandler);
            element.addEventListener('pointerup', this.pointerUpHandler);
            element.addEventListener('pointercancel', this.pointerUpHandler);
            window.addEventListener('blur', this.pointerBlurHandler);

            this.pointerElement = element;
        },

        teardownPointerListener() {
            if (this.pointerBlurHandler) {
                this.pointerBlurHandler();
                window.removeEventListener('blur', this.pointerBlurHandler);
                this.pointerBlurHandler = null;
            }
            if (this.pointerElement) {
                this.pointerElement.removeEventListener('pointerdown', this.pointerDownHandler);
                this.pointerElement.removeEventListener('pointermove', this.pointerMoveHandler);
                this.pointerElement.removeEventListener('pointerup', this.pointerUpHandler);
                this.pointerElement.removeEventListener('pointercancel', this.pointerUpHandler);
                this.pointerElement = null;
            }
            if (this.nexusTouchTarget) {
                ['touchstart', 'touchmove', 'touchend'].forEach(type =>
                    this.nexusTouchTarget.removeEventListener(type, this.nexusTouchBlocker, true));
                this.nexusTouchTarget = null;
            }
            this.pointerDownHandler = null;
            this.pointerMoveHandler = null;
            this.pointerUpHandler = null;
            this.nexusTouchBlocker = null;
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