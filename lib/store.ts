import { create } from 'zustand'

export type WeatherState = 'clear' | 'fog' | 'rain' | 'storm'
export type ZoneId = 'cabin' | 'ruins' | 'waterfall' | 'grove' | 'firefly' | 'campfire' | null

export interface GameStore {
  weather: WeatherState
  setWeather: (w: WeatherState) => void
  activeZone: ZoneId
  enteredZone: ZoneId
  setActiveZone: (z: ZoneId) => void
  enterZone: (z: ZoneId) => void
  exitZone: () => void
  muted: boolean
  toggleMute: () => void
  loaded: boolean
  setLoaded: () => void
}

export const useGameStore = create<GameStore>((set) => ({
  weather: 'clear',
  setWeather: (weather) => set({ weather }),
  activeZone: null,
  enteredZone: null,
  setActiveZone: (activeZone) => set({ activeZone }),
  enterZone: (enteredZone) => set({ enteredZone }),
  exitZone: () => set({ enteredZone: null }),
  muted: false,
  toggleMute: () => set((s) => ({ muted: !s.muted })),
  loaded: false,
  setLoaded: () => set({ loaded: true }),
}))
