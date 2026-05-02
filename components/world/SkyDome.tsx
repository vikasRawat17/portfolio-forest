import { Sky, Stars } from '@react-three/drei'
import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGameStore } from '@/lib/store'
import * as THREE from 'three'
import type { WeatherState } from '@/lib/store'

const SKY_TARGET: Record<WeatherState, {
  turbidity: number
  rayleigh: number
  starsOpacity: number
  ambientColor: string
  ambientIntensity: number
}> = {
  clear: { turbidity: 8,  rayleigh: 0.5, starsOpacity: 1,   ambientColor: '#334488', ambientIntensity: 0.35 },
  fog:   { turbidity: 20, rayleigh: 2,   starsOpacity: 0,   ambientColor: '#223322', ambientIntensity: 0.2  },
  rain:  { turbidity: 25, rayleigh: 3,   starsOpacity: 0,   ambientColor: '#1a2233', ambientIntensity: 0.15 },
  storm: { turbidity: 30, rayleigh: 4,   starsOpacity: 0,   ambientColor: '#111122', ambientIntensity: 0.1  },
}

const _ambientColor = new THREE.Color()

export function SkyDome() {
  const weather = useGameStore((s) => s.weather)
  const t = SKY_TARGET[weather]
  const current = useRef({ turbidity: 8, rayleigh: 0.5 })
  const ambientRef = useRef<THREE.AmbientLight>(null)

  useFrame((_, delta) => {
    const speed = delta * 0.4
    current.current.turbidity += (t.turbidity - current.current.turbidity) * speed
    current.current.rayleigh  += (t.rayleigh  - current.current.rayleigh)  * speed
    if (ambientRef.current) {
      _ambientColor.set(t.ambientColor)
      ambientRef.current.color.lerp(_ambientColor, speed)
      ambientRef.current.intensity += (t.ambientIntensity - ambientRef.current.intensity) * speed
    }
  })

  return (
    <>
      <Sky
        distance={350}
        sunPosition={[-20, -2, 10]}
        turbidity={current.current.turbidity}
        rayleigh={current.current.rayleigh}
        mieCoefficient={0.005}
        mieDirectionalG={0.8}
      />
      {t.starsOpacity > 0 && (
        <Stars radius={100} depth={50} count={3000} factor={4} fade speed={0} saturation={0} />
      )}
      <ambientLight ref={ambientRef} color={SKY_TARGET.clear.ambientColor} intensity={SKY_TARGET.clear.ambientIntensity} />
    </>
  )
}
