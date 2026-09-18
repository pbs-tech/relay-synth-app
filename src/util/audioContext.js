import * as Tone from "tone";

// Tone 14 builds its context on standardized-audio-context, whose AudioContext
// omits the deprecated createScriptProcessor. NexusUI still relies on it (its
// WAAClock scheduler and the Oscilloscope), and the Nexus oscilloscope connects
// straight into the Tone graph, so the two have to share one context. Tone 13
// used a plain native context, which is why this worked before the upgrade.
// Hand Tone a native AudioContext and let Nexus use the same one.
export function installNativeAudioContext() {
    const NativeAudioContext = window.AudioContext || window.webkitAudioContext;
    if (!NativeAudioContext) return;
    Tone.setContext(new Tone.Context(new NativeAudioContext()));
}

// Browsers create the AudioContext suspended and only allow it to resume from a
// user gesture. Tone 13 resumed implicitly on the first interaction; Tone 14
// requires an explicit Tone.start(), without which every synth, transport and
// loop runs normally but produces silence.
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
