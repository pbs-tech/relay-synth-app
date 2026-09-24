import { expect } from 'chai'
import { polyfillListenerParams } from '@/util/audioListener'

const PARAMS = {
    positionX: 0, positionY: 0, positionZ: 0,
    forwardX: 0, forwardY: 0, forwardZ: -1,
    upX: 0, upY: 1, upZ: 0
}

// Stands in for a native context. Gecko's AudioListener has only the deprecated
// setPosition()/setOrientation(), so its listener starts out bare.
const fakeContext = (listener = {}) => {
    const sources = []
    return {
        listener,
        sources,
        createConstantSource() {
            const source = { offset: { value: 1 } }
            sources.push(source)
            return source
        }
    }
}

describe('polyfillListenerParams', () => {
    it('gives a listener without AudioParams one per axis, at the spec defaults', () => {
        const context = fakeContext()
        polyfillListenerParams(context)
        Object.entries(PARAMS).forEach(([name, value]) => {
            expect(context.listener[name], name).to.have.property('value', value)
        })
    })

    it('backs each one with its own real AudioParam', () => {
        const context = fakeContext()
        polyfillListenerParams(context)
        const params = Object.keys(PARAMS).map(name => context.listener[name])
        expect(params).to.deep.equal(context.sources.map(s => s.offset))
        expect(new Set(params).size).to.equal(Object.keys(PARAMS).length)
    })

    it('leaves a listener that already has them alone', () => {
        const native = {}
        Object.keys(PARAMS).forEach(name => { native[name] = { native: name } })
        const context = fakeContext({ ...native })
        polyfillListenerParams(context)
        expect(context.listener).to.deep.equal(native)
        expect(context.sources).to.be.empty
    })
})
