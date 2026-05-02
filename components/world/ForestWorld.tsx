'use client'
import { Canvas } from '@react-three/fiber'
import { Physics } from '@react-three/rapier'
import { Terrain } from './Terrain'
import { SkyDome } from './SkyDome'
import { Vegetation } from './Vegetation'
import { Hunter } from '@/components/hunter/Hunter'

export default function ForestWorld() {
  return (
    <Canvas
      shadows
      camera={{ fov: 60, near: 0.1, far: 400, position: [0, 30, 60] }}
      style={{ width: '100vw', height: '100vh', background: '#08080c' }}
    >
      <SkyDome />
      <directionalLight
        position={[20, 40, 10]}
        intensity={0.8}
        color="#8899cc"
        castShadow
        shadow-mapSize={[2048, 2048]}
      />
      <Physics gravity={[0, -20, 0]}>
        <Terrain />
        <Vegetation />
        <Hunter />
      </Physics>
    </Canvas>
  )
}
