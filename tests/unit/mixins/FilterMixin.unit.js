import { expect } from 'chai'
import FilterMixin from '@/mixins/FilterMixin'

// The mixin's methods run with the component as `this` - setFilterCutoffListener
// reads FILTER_MAX off it - so they are invoked against the mixin's own data
// rather than bare, which under strict ESM would make `this` undefined.
const context = FilterMixin.data()
const setFilterType = (...args) => FilterMixin.methods.setFilterType.apply(context, args)
const setFilterCutoffListener = (...args) =>
    FilterMixin.methods.setFilterCutoffListener.apply(context, args)

// Tone's Filter asserts its type against exactly this list and throws
// `Invalid filter type: <value>` for anything else, so the fake does the same.
// Without that, a regression here reaches the browser rather than the suite.
const VALID_FILTER_TYPES = [
    'lowpass', 'highpass', 'bandpass', 'lowshelf',
    'highshelf', 'notch', 'allpass', 'peaking'
]

// The two points FilterSettings seeds the envelope with on mount.
const INITIAL_POINTS = [{ x: 0.25, y: 0.65 }, { x: 0.25, y: 0.01 }]

const fakeEnvelope = (points = INITIAL_POINTS) => ({
    points: points.map(p => ({ ...p })),
    setPoints(next) { this.points = next.map(p => ({ ...p })) },
    movePoint(i, x, y) { this.points[i] = { x, y } },
    on() {}
})

const fakeSynth = (type = 'lowpass') => ({
    filterType: type,
    get() { return { filter: { type: this.filterType } } },
    set(options) {
        // Tone only validates the keys present; a cutoff change sends
        // frequency alone and never touches type.
        if (!('type' in options.filter)) return
        const next = options.filter.type
        if (!VALID_FILTER_TYPES.includes(next)) {
            throw new Error(`Invalid filter type: ${next}`)
        }
        this.filterType = next
    }
})

// Nexus hands its two controls different payloads: a select's change carries
// an object with a `value`, a slider's carries the number itself. The fakes
// keep that difference, because the mixin reads each one differently.
const fakeSelect = () => {
    const select = {
        on(event, handler) { select.handler = handler },
        emit(value) { select.handler({ value }) }
    }
    return select
}

const fakeSlider = () => {
    const slider = {
        on(event, handler) { slider.handler = handler },
        emit(value) { slider.handler(value) }
    }
    return slider
}

describe('FilterMixin', () => {
    describe('setFilterType', () => {
        it("applies allpass for 'No Filter' rather than an undefined type", () => {
            const synth = fakeSynth('lowpass')
            const envelope = fakeEnvelope()
            const select = fakeSelect()

            setFilterType(synth, select, envelope, null)
            select.emit('No Filter')

            expect(synth.filterType).to.equal('allpass')
            expect(envelope.points).to.have.lengthOf(0)
        })

        it("does not reapply the previously selected type on 'No Filter'", () => {
            const synth = fakeSynth('lowpass')
            const select = fakeSelect()

            setFilterType(synth, select, fakeEnvelope(), null)
            select.emit('Filter Type 3')
            expect(synth.filterType).to.equal('highpass')

            select.emit('No Filter')
            expect(synth.filterType).to.equal('allpass')
        })

        // 'No Filter' empties the envelope, so every other case has to cope
        // with there being no points to read back.
        const cases = [
            ['Filter Type 1', 'bandpass'],
            ['Filter Type 2', 'lowpass'],
            ['Filter Type 3', 'highpass']
        ]
        cases.forEach(([label, expected]) => {
            it(`selects ${expected} after 'No Filter' emptied the envelope`, () => {
                const synth = fakeSynth('lowpass')
                const select = fakeSelect()

                setFilterType(synth, select, fakeEnvelope(), null)
                select.emit('No Filter')
                select.emit(label)

                expect(synth.filterType).to.equal(expected)
            })
        })

        it('leaves the synth untouched for an unrecognised label', () => {
            const synth = fakeSynth('lowpass')
            const select = fakeSelect()

            setFilterType(synth, select, fakeEnvelope(), null)
            select.emit('Not A Filter')

            expect(synth.filterType).to.equal('lowpass')
        })

        it('maps the real names /play shows back onto the neutral ones', () => {
            const synth = fakeSynth('lowpass')
            const select = fakeSelect()
            const labelMap = {
                'No Filter': 'No Filter',
                Bandpass: 'Filter Type 1',
                Lowpass: 'Filter Type 2',
                Highpass: 'Filter Type 3'
            }

            setFilterType(synth, select, fakeEnvelope(), labelMap)
            select.emit('Highpass')
            expect(synth.filterType).to.equal('highpass')

            select.emit('No Filter')
            expect(synth.filterType).to.equal('allpass')
        })
    })

    describe('setFilterCutoffListener', () => {
        it('moves both points for a two point envelope', () => {
            const synth = fakeSynth('lowpass')
            const envelope = fakeEnvelope()
            const slider = fakeSlider()

            setFilterCutoffListener(synth, slider, envelope)
            slider.emit(5000)

            expect(envelope.points[0].x).to.equal(5000 / 20000)
            expect(envelope.points[1].x).to.equal(5000 / 20000)
        })

        it('survives an empty envelope under allpass', () => {
            const synth = fakeSynth('lowpass')
            const envelope = fakeEnvelope()
            const select = fakeSelect()
            const slider = fakeSlider()

            setFilterType(synth, select, envelope, null)
            select.emit('No Filter')

            setFilterCutoffListener(synth, slider, envelope)
            expect(() => slider.emit(5000)).to.not.throw()
        })
    })
})
