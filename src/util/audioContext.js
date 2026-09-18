import * as Tone from "tone";

// Browsers create the AudioContext in a suspended state and only allow it to
// resume from a user gesture. Tone 13 resumed implicitly on the first
// interaction; Tone 14 requires an explicit Tone.start(), without which every
// synth, transport and loop runs normally but produces silence.
const GESTURES = ["mousedown", "touchstart", "keydown"];

let unlocked = false;

export function unlockAudio() {
    if (unlocked) return Promise.resolve();
    unlocked = true;
    return Tone.start();
}

export function installAudioUnlock() {
    const handler = () => {
        unlockAudio();
        GESTURES.forEach(e => window.removeEventListener(e, handler));
    };
    GESTURES.forEach(e => window.addEventListener(e, handler));
}
