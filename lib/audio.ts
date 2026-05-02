import { Howl, Howler } from 'howler'
import type { WeatherState } from './store'

let baseLoop: Howl | null = null
let rainLoop: Howl | null = null
let windLoop: Howl | null = null

export function initAudio(): void {
  baseLoop = new Howl({ src: ['/sounds/forest-night.mp3'], loop: true, volume: 0.4 })
  rainLoop = new Howl({ src: ['/sounds/rain-loop.mp3'],    loop: true, volume: 0   })
  windLoop = new Howl({ src: ['/sounds/wind-eerie.mp3'],   loop: true, volume: 0   })
  baseLoop.play()
  rainLoop.play()
  windLoop.play()
}

export function setWeatherAudio(weather: WeatherState): void {
  const duration = 2000
  switch (weather) {
    case 'clear':
      rainLoop?.fade(rainLoop.volume(), 0,    duration)
      windLoop?.fade(windLoop.volume(), 0,    duration)
      break
    case 'fog':
      rainLoop?.fade(rainLoop.volume(), 0,    duration)
      windLoop?.fade(windLoop.volume(), 0.35, duration)
      break
    case 'rain':
      rainLoop?.fade(rainLoop.volume(), 0.5,  duration)
      windLoop?.fade(windLoop.volume(), 0,    duration)
      break
    case 'storm':
      rainLoop?.fade(rainLoop.volume(), 0.75, duration)
      windLoop?.fade(windLoop.volume(), 0.2,  duration)
      scheduleThunder()
      break
  }
}

let thunderTimer: ReturnType<typeof setTimeout> | null = null

function scheduleThunder(): void {
  const delay = 8000 + Math.random() * 17000
  thunderTimer = setTimeout(() => {
    const n = Math.ceil(Math.random() * 3)
    const thunder = new Howl({ src: [`/sounds/thunder-${n}.mp3`], volume: 0.6 })
    thunder.play()
    scheduleThunder()
  }, delay)
}

export function stopThunder(): void {
  if (thunderTimer) clearTimeout(thunderTimer)
  thunderTimer = null
}

export function setMuted(muted: boolean): void {
  Howler.mute(muted)
}
