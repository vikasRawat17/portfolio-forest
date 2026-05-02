import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGameStore } from '@/lib/store'
import * as THREE from 'three'

const COUNT = 1500

const POSITIONS = (() => {
  const arr = new Float32Array(COUNT * 3)
  for (let i = 0; i < COUNT; i++) {
    arr[i * 3]     = (Math.random() - 0.5) * 80
    arr[i * 3 + 1] = Math.random() * 40
    arr[i * 3 + 2] = (Math.random() - 0.5) * 80
  }
  return arr
})()

export function WeatherParticles() {
  const weather = useGameStore((s) => s.weather)
  const ref = useRef<THREE.Points>(null)

  const isRaining = weather === 'rain' || weather === 'storm'

  useFrame((_, delta) => {
    const pts = ref.current
    if (!pts || !isRaining) return
    const pos = pts.geometry.attributes.position.array as Float32Array
    for (let i = 0; i < COUNT; i++) {
      pos[i * 3 + 1] -= delta * (weather === 'storm' ? 28 : 18)
      if (pos[i * 3 + 1] < 0) pos[i * 3 + 1] = 40
    }
    pts.geometry.attributes.position.needsUpdate = true
  })

  return (
    <points ref={ref} visible={isRaining}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[POSITIONS, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color="#aabbdd"
        size={0.06}
        transparent
        opacity={weather === 'storm' ? 0.7 : 0.45}
        sizeAttenuation
      />
    </points>
  )
}
