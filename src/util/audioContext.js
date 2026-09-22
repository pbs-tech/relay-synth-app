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
    // disposeOld closes the standardized-audio-context AudioContext that Tone
    // opened for itself the moment it was imported. Nothing is ever connected
    // to it, but without this it stays open and suspended for the life of the
    // page and still counts against the per-page AudioContext limit - four on
    // iOS Safari, and NexusUI already opens one of its own at import.
    Tone.setContext(new Tone.Context(new NativeAudioContext()), true);
}

// Browsers create the AudioContext suspended and only allow it to resume from a
// user gesture. Tone 13 resumed implicitly on the first interaction; Tone 14
// requires an explicit Tone.start(), without which every synth, transport and
// loop runs normally but produces silence.
//
// Which events count is not a matter of taste. The HTML spec's list of
// activation triggering input events has mousedown, keydown, pointerup and
// touchend on it, and touchstart deliberately *not* - so unlocking on
// touchstart, as this used to, spends the one attempt on an event that grants
// no activation at all. iOS Safari refuses that resume outright.
const GESTURES = ["mousedown", "keydown", "pointerup", "touchend"];

// NexusUI's piano calls stopPropagation() on the touch events it handles, so a
// listener that waited for them to bubble up to window would never see a tap on
// the keys - the one gesture a synth can count on. Listen in the capture phase.
const CAPTURE = true;

let armedHandler = null;
let blocked = false;
const subscribers = new Set();

function contextState() {
    try {
        return Tone.getContext().state;
    } catch (e) {
        return "closed";
    }
}

function setBlocked(value) {
    if (blocked === value) return;
    blocked = value;
    subscribers.forEach(notify => notify(blocked));
}

export function isAudioBlocked() {
    return blocked;
}

// Lets the UI offer a way out when the browser will not resume on a gesture
// alone. Calls back immediately with the current state so a late subscriber
// still renders correctly.
export function onAudioBlockedChange(notify) {
    subscribers.add(notify);
    notify(blocked);
    return () => subscribers.delete(notify);
}

// Resolves to whether audio is actually running afterwards. Tone.start()
// rejecting and Tone.start() resolving while the context stays suspended both
// mean the browser refused - privacy-hardened Firefox forks block autoplay by
// default and do the latter - so the context state is what gets believed, never
// the promise on its own.
export async function unlockAudio() {
    if (contextState() === "running") {
        setBlocked(false);
        return true;
    }
    try {
        await Tone.start();
    } catch (e) {
        // Refused. The state check below is the real answer either way.
    }
    const running = contextState() === "running";
    setBlocked(!running);
    return running;
}

function arm() {
    if (armedHandler || contextState() === "running") return;
    armedHandler = () => {
        unlockAudio().then(running => {
            if (running) disarm();
        });
    };
    GESTURES.forEach(type => window.addEventListener(type, armedHandler, CAPTURE));
}

function disarm() {
    if (!armedHandler) return;
    GESTURES.forEach(type => window.removeEventListener(type, armedHandler, CAPTURE));
    armedHandler = null;
}

export function installAudioUnlock() {
    arm();

    // The context can go back to suspended long after the first unlock: iOS
    // does it for any audio interruption - a call, Siri, the lock button - and
    // any browser may do it when a backgrounded tab is discarded and restored.
    // The previous version unhooked itself after one gesture and set a latch
    // before Tone.start() had even resolved, so a page that lost its context,
    // or never got one, stayed silent for good with nothing left to retry.
    Tone.getContext().on("statechange", state => {
        if (state === "running") {
            setBlocked(false);
            disarm();
        } else {
            arm();
        }
    });
}
