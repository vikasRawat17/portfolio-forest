import type { WeatherState } from './store'
import { useGameStore } from './store'

export const WEATHER_STATES: WeatherState[] = ['clear', 'fog', 'rain', 'storm']

const MIN_MS = 60_000
const MAX_MS = 180_000

export function randomNext(current: WeatherState): WeatherState {
  const others = WEATHER_STATES.filter((s) => s !== current)
  return others[Math.floor(Math.random() * others.length)]
}

let timer: ReturnType<typeof setTimeout> | null = null

export function startWeatherCycle(): void {
  if (timer !== null) return
  function tick() {
    const { weather, setWeather } = useGameStore.getState()
    setWeather(randomNext(weather))
    timer = setTimeout(tick, MIN_MS + Math.random() * (MAX_MS - MIN_MS))
  }
  timer = setTimeout(tick, MIN_MS + Math.random() * (MAX_MS - MIN_MS))
}

export function stopWeatherCycle(): void {
  if (timer) clearTimeout(timer)
  timer = null
}
