import { expect } from 'chai'
import IOMixin from '@/mixins/IOMixin'

// The mixin's methods read keyMap and inputMap off the component, so they are
// invoked against the mixin's own data rather than bare.
// The handlers register themselves on window, so capture them where they are
// registered and call them directly. Only the two methods are swapped, and they
// are put back afterwards - replacing window outright would break the jsdom the
// component specs in this suite rely on.
const makeContext = () => {
    const context = IOMixin.data()
    const listeners = {}
    const original = {
        addEventListener: window.addEventListener,
        removeEventListener: window.removeEventListener
    }
    window.addEventListener = (type, fn) => { listeners[type] = fn }
    window.removeEventListener = (type) => { delete listeners[type] }
    return { context, listeners, restore: () => Object.assign(window, original) }
}

const fakePiano = () => ({
    toggled: [],
    toggleKey(note, on) { this.toggled.push([note, on]) }
})

const keyEvent = (keyCode, modifiers = {}) => ({
    keyCode,
    ctrlKey: false,
    metaKey: false,
    altKey: false,
    prevented: false,
    preventDefault() { this.prevented = true },
    ...modifiers
})

const Z = 90   // maps to MIDI 48 in the mixin's keyMap

describe('IOMixin', () => {
    let active = null
    afterEach(() => { if (active) { active.restore(); active = null } })

    it('plays the mapped note and takes the key from the browser', () => {
        const { context, listeners, restore } = makeContext()
        active = { restore }
        const piano = fakePiano()
        IOMixin.methods.setKeysDown.call(context, null, piano)

        const event = keyEvent(Z)
        listeners.keydown(event)

        expect(piano.toggled).to.deep.equal([[48, true]])
        // Without preventDefault, Firefox's find-as-you-type opens the find bar
        // on a bare letter and swallows every keystroke after it.
        expect(event.prevented).to.equal(true)
    })

    it('leaves modifier chords to the browser', () => {
        const { context, listeners, restore } = makeContext()
        active = { restore }
        const piano = fakePiano()
        IOMixin.methods.setKeysDown.call(context, null, piano)

        for (const modifier of ['ctrlKey', 'metaKey', 'altKey']) {
            const event = keyEvent(Z, { [modifier]: true })
            listeners.keydown(event)
            expect(event.prevented, modifier).to.equal(false)
        }

        expect(piano.toggled).to.deep.equal([])
    })

    it('ignores an unmapped key entirely', () => {
        const { context, listeners, restore } = makeContext()
        active = { restore }
        const piano = fakePiano()
        IOMixin.methods.setKeysDown.call(context, null, piano)

        const event = keyEvent(27)   // Escape
        listeners.keydown(event)

        expect(piano.toggled).to.deep.equal([])
        expect(event.prevented).to.equal(false)
    })

    it('attacks a held key once and releases it on keyup', () => {
        const { context, listeners, restore } = makeContext()
        active = { restore }
        const piano = fakePiano()
        IOMixin.methods.setKeysDown.call(context, null, piano)
        IOMixin.methods.setKeysUp.call(context, null, piano)

        listeners.keydown(keyEvent(Z))
        listeners.keydown(keyEvent(Z))   // OS key repeat
        listeners.keyup(keyEvent(Z))

        expect(piano.toggled).to.deep.equal([[48, true], [48, false]])
    })
})
