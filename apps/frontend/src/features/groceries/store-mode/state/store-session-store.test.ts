import { beforeEach, describe, expect, it } from 'vitest'
import { useStoreSessionStore } from './store-session-store'

beforeEach(() => {
  useStoreSessionStore.setState(useStoreSessionStore.getInitialState(), true)
})

function statuses() {
  return useStoreSessionStore.getState().statuses
}

function swaps() {
  return useStoreSessionStore.getState().swaps
}

describe('toggleChecked', () => {
  it('checks a pending item and unchecks it back to pending', () => {
    useStoreSessionStore.getState().toggleChecked('milk')
    expect(statuses()).toEqual({ milk: 'checked' })

    useStoreSessionStore.getState().toggleChecked('milk')
    expect(statuses()).toEqual({})
  })

  it('overrides a skipped item', () => {
    useStoreSessionStore.getState().toggleSkipped('milk')

    useStoreSessionStore.getState().toggleChecked('milk')

    expect(statuses()).toEqual({ milk: 'checked' })
  })

  it('leaves other items untouched', () => {
    useStoreSessionStore.getState().toggleChecked('milk')

    useStoreSessionStore.getState().toggleChecked('bread')

    expect(statuses()).toEqual({ milk: 'checked', bread: 'checked' })
  })
})

describe('toggleSkipped', () => {
  it('skips a pending item and unskips it back to pending', () => {
    useStoreSessionStore.getState().toggleSkipped('milk')
    expect(statuses()).toEqual({ milk: 'skipped' })

    useStoreSessionStore.getState().toggleSkipped('milk')
    expect(statuses()).toEqual({})
  })

  it('overrides a checked item', () => {
    useStoreSessionStore.getState().toggleChecked('milk')

    useStoreSessionStore.getState().toggleSkipped('milk')

    expect(statuses()).toEqual({ milk: 'skipped' })
  })
})

describe('recordSwap', () => {
  it('remembers the name from before the first swap through chained swaps', () => {
    useStoreSessionStore.getState().recordSwap('herb', 'Cilantro')
    useStoreSessionStore.getState().recordSwap('herb', 'Parsley')

    expect(swaps()).toEqual({ herb: 'Cilantro' })
  })
})

describe('clearSwap', () => {
  it('drops only the given swap', () => {
    useStoreSessionStore.getState().recordSwap('herb', 'Cilantro')
    useStoreSessionStore.getState().recordSwap('greens', 'Baby spinach')

    useStoreSessionStore.getState().clearSwap('herb')

    expect(swaps()).toEqual({ greens: 'Baby spinach' })
  })
})

describe('clear', () => {
  it('drops every status and swap at once', () => {
    useStoreSessionStore.getState().toggleChecked('milk')
    useStoreSessionStore.getState().toggleSkipped('bread')
    useStoreSessionStore.getState().recordSwap('herb', 'Cilantro')

    useStoreSessionStore.getState().clear()

    expect(statuses()).toEqual({})
    expect(swaps()).toEqual({})
  })
})
