import { describe, it, expect } from 'vitest'
import { randomNext, WEATHER_STATES } from './weatherCycle'
import type { WeatherState } from './store'

describe('randomNext', () => {
  it('never returns current state', () => {
    WEATHER_STATES.forEach((state) => {
      for (let i = 0; i < 50; i++) {
        expect(randomNext(state)).not.toBe(state)
      }
    })
  })

  it('always returns a valid WeatherState', () => {
    WEATHER_STATES.forEach((state) => {
      expect(WEATHER_STATES).toContain(randomNext(state))
    })
  })
})
