import { expect } from 'chai'
import { createPinia, setActivePinia } from 'pinia'
import * as Tone from 'tone'
import synthTypes from '@/util/SynthTypes'
import { useSynthsStore } from '@/stores/useSynthsStore'

// A stand-in for a Tone voice: checkAnswer only ever calls .get() on it.
const fakeSynth = (params) => ({ get: () => params })

describe('useSynthsStore', () => {
    beforeEach(function() {
        setActivePinia(createPinia())
    })

    // Tone v14 removed the default export. Importing it as `Tone` yielded
    // undefined and threw as soon as SynthTypes was loaded.
    it('resolves real Tone constructors', function() {
        expect(Tone.PolySynth).to.be.a('function')
        expect(Tone.MonoSynth).to.be.a('function')
        expect(synthTypes.get('Synth')).to.be.a('function')
        expect(synthTypes.get('Mono Synth')).to.be.a('function')
    })

    it('matches when the required parameters are identical', function() {
        const store = useSynthsStore()
        store.setRequirements({ oscillator: {}, envelope: {} })
        const params = { oscillator: { type: 'sine' }, envelope: { attack: 0.1 } }
        store.userSynth = fakeSynth(params)
        store.tutorialSynth = fakeSynth(params)

        store.checkAnswer()

        expect(store.matching).to.be.true
        expect(store.noOfGuesses).to.equal(0)
    })

    it('does not match when a required parameter differs', function() {
        const store = useSynthsStore()
        store.setRequirements({ oscillator: {} })
        store.userSynth = fakeSynth({ oscillator: { type: 'square' } })
        store.tutorialSynth = fakeSynth({ oscillator: { type: 'sine' } })

        store.checkAnswer()

        expect(store.matching).to.be.false
        expect(store.noOfGuesses).to.equal(1)
    })

    // The parameters were seeded as {} and only turned into a string by the
    // oscillator branch, so any tutorial without one hit {}.concat.
    it('compares parameters when no oscillator is required', function() {
        const store = useSynthsStore()
        store.setRequirements({ envelope: {}, filter: {} })
        const params = { envelope: { attack: 0.2 }, filter: { type: 'lowpass' } }
        store.userSynth = fakeSynth(params)
        store.tutorialSynth = fakeSynth(params)

        expect(() => store.checkAnswer()).to.not.throw()
        expect(store.matching).to.be.true
    })

    it('only flags the parameter groups the tutorial asks for', function() {
        const store = useSynthsStore()
        store.setRequirements({ envelope: {} })

        expect(store.envRequired).to.be.true
        expect(store.oscRequired).to.be.false
        expect(store.filterRequired).to.be.false
        expect(store.filterEnvRequired).to.be.false
    })

    it('clears tutorial progress on reset', function() {
        const store = useSynthsStore()
        store.setMatching(false)
        store.setShowAnswer(true)

        store.resetTutorial()

        expect(store.matching).to.be.undefined
        expect(store.noOfGuesses).to.equal(0)
        expect(store.showAnswer).to.be.false
        expect(store.tutorialParams).to.equal('')
    })
})
