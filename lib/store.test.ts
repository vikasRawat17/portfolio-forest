import { describe, it, expect, beforeEach } from 'vitest'
import { useGameStore } from './store'

beforeEach(() => {
  useGameStore.setState({
    weather: 'clear',
    activeZone: null,
    enteredZone: null,
    muted: false,
    loaded: false,
  })
})

describe('weather', () => {
  it('sets weather state', () => {
    useGameStore.getState().setWeather('rain')
    expect(useGameStore.getState().weather).toBe('rain')
  })
})

describe('zones', () => {
  it('sets active zone', () => {
    useGameStore.getState().setActiveZone('cabin')
    expect(useGameStore.getState().activeZone).toBe('cabin')
  })

  it('enterZone sets enteredZone', () => {
    useGameStore.getState().enterZone('ruins')
    expect(useGameStore.getState().enteredZone).toBe('ruins')
  })

  it('exitZone clears enteredZone', () => {
    useGameStore.getState().enterZone('ruins')
    useGameStore.getState().exitZone()
    expect(useGameStore.getState().enteredZone).toBeNull()
  })
})

describe('mute', () => {
  it('toggles muted', () => {
    useGameStore.getState().toggleMute()
    expect(useGameStore.getState().muted).toBe(true)
    useGameStore.getState().toggleMute()
    expect(useGameStore.getState().muted).toBe(false)
  })
})

describe('loaded', () => {
  it('setLoaded sets loaded to true', () => {
    useGameStore.getState().setLoaded()
    expect(useGameStore.getState().loaded).toBe(true)
  })
})
