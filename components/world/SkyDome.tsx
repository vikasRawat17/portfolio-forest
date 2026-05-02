import { Sky, Stars } from '@react-three/drei'
import { useGameStore } from '@/lib/store'
import type { WeatherState } from '@/lib/store'

const SKY_CONFIG: Record<WeatherState, {
  sunPosition: [number, number, number]
  turbidity: number
  rayleigh: number
  starsOpacity: number
  ambientColor: string
  ambientIntensity: number
}> = {
  clear:  { sunPosition: [-20, -2, 10], turbidity: 8,  rayleigh: 0.5, starsOpacity: 1,   ambientColor: '#334488', ambientIntensity: 0.35 },
  fog:    { sunPosition: [-20, -2, 10], turbidity: 20, rayleigh: 2,   starsOpacity: 0,   ambientColor: '#223322', ambientIntensity: 0.2  },
  rain:   { sunPosition: [-20, -3, 10], turbidity: 25, rayleigh: 3,   starsOpacity: 0,   ambientColor: '#1a2233', ambientIntensity: 0.15 },
  storm:  { sunPosition: [-20, -4, 10], turbidity: 30, rayleigh: 4,   starsOpacity: 0,   ambientColor: '#111122', ambientIntensity: 0.1  },
}

export function SkyDome() {
  const weather = useGameStore((s) => s.weather)
  const cfg = SKY_CONFIG[weather]

  return (
    <>
      <Sky
        distance={350}
        sunPosition={cfg.sunPosition}
        turbidity={cfg.turbidity}
        rayleigh={cfg.rayleigh}
        mieCoefficient={0.005}
        mieDirectionalG={0.8}
      />
      {cfg.starsOpacity > 0 && (
        <Stars
          radius={100}
          depth={50}
          count={3000}
          factor={4}
          fade
          speed={0}
          saturation={0}
        />
      )}
      <ambientLight color={cfg.ambientColor} intensity={cfg.ambientIntensity} />
    </>
  )
}
