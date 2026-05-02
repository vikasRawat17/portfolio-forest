import { useFrame, useThree } from '@react-three/fiber'
import { useRef } from 'react'
import { useGameStore } from '@/lib/store'
import * as THREE from 'three'
import type { WeatherState } from '@/lib/store'

const FOG_TARGET: Record<WeatherState, { near: number; far: number; color: string }> = {
  clear: { near: 80,  far: 200, color: '#060c15' },
  fog:   { near: 8,   far: 35,  color: '#0d1a10' },
  rain:  { near: 30,  far: 90,  color: '#0a0f18' },
  storm: { near: 15,  far: 50,  color: '#070710' },
}

export function WeatherFog() {
  const { scene } = useThree()
  const weather = useGameStore((s) => s.weather)
  const target = FOG_TARGET[weather]
  const current = useRef({ near: 80, far: 200 })

  useFrame((_, delta) => {
    const s = delta * 0.4
    current.current.near += (target.near - current.current.near) * s
    current.current.far  += (target.far  - current.current.far)  * s

    if (!scene.fog) {
      scene.fog = new THREE.Fog(target.color, current.current.near, current.current.far)
    } else {
      ;(scene.fog as THREE.Fog).near = current.current.near
      ;(scene.fog as THREE.Fog).far  = current.current.far
    }
  })

  return null
}
