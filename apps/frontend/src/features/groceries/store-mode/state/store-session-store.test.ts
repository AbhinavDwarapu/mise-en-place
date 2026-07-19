import { beforeEach, describe, expect, it } from 'vitest'
import { useStoreSessionStore } from './store-session-store'

beforeEach(() => {
  useStoreSessionStore.setState(useStoreSessionStore.getInitialState(), true)
})

function statuses() {
  return useStoreSessionStore.getState().statuses
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

describe('clear', () => {
  it('drops every status at once', () => {
    useStoreSessionStore.getState().toggleChecked('milk')
    useStoreSessionStore.getState().toggleSkipped('bread')

    useStoreSessionStore.getState().clear()

    expect(statuses()).toEqual({})
  })
})
