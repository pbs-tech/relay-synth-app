// The AudioListener's AudioParams, with the defaults the Web Audio spec gives
// them.
const LISTENER_PARAMS = {
    positionX: 0, positionY: 0, positionZ: 0,
    forwardX: 0, forwardY: 0, forwardZ: -1,
    upX: 0, upY: 1, upZ: 0
};

// Gecko's AudioListener has never implemented positionX..upZ - only the
// deprecated setPosition() and setOrientation() - so on every Firefox-based
// browser they are undefined. Tone builds a Listener for every context the
// first time anything reaches the destination, and wraps each of those in a
// Param that asserts it was handed an AudioParam. On a native Gecko context
// that assertion throws out of the first toDestination(), so no synth is ever
// built and the page is silent. standardized-audio-context patched this over,
// which is why it only broke once Tone was handed a native context.
//
// Nothing here positions sound in space, so each one only has to be a real
// AudioParam that holds a value. A ConstantSourceNode's offset is one, and
// left unstarted and unconnected it does nothing else.
export function polyfillListenerParams(context) {
    const listener = context.listener;
    Object.keys(LISTENER_PARAMS).forEach(name => {
        if (listener[name]) return;
        const param = context.createConstantSource().offset;
        param.value = LISTENER_PARAMS[name];
        Object.defineProperty(listener, name, { value: param, configurable: true });
    });
}
