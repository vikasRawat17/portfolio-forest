'use client'
import { useRef, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { Physics } from '@react-three/rapier'
import * as THREE from 'three'
import { Terrain } from './Terrain'
import { SkyDome } from './SkyDome'
import { Vegetation } from './Vegetation'
import { WeatherFog } from './WeatherFog'
import { WeatherParticles } from './WeatherParticles'
import { Hunter } from '@/components/hunter/Hunter'
import { HunterCamera } from '@/components/hunter/HunterCamera'
import { AnimalSpawner } from '@/components/animals/AnimalSpawner'
import { ZoneManager } from '@/components/zones/ZoneManager'
import { Landmarks } from './Landmarks'
import { startWeatherCycle, stopWeatherCycle } from '@/lib/weatherCycle'

export default function ForestWorld() {
  const hunterMeshRef = useRef<THREE.Group>(null)

  useEffect(() => {
    startWeatherCycle()
    return () => stopWeatherCycle()
  }, [])

  return (
    <Canvas
      shadows
      camera={{ fov: 60, near: 0.1, far: 400, position: [0, 5, 9] }}
      style={{ width: '100vw', height: '100vh', background: '#08080c' }}
    >
      <SkyDome />
      <WeatherFog />
      <WeatherParticles />
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
        <Hunter meshRef={hunterMeshRef} />
        <AnimalSpawner hunterRef={hunterMeshRef} />
        <ZoneManager />
        <Landmarks />
      </Physics>
      <HunterCamera targetRef={hunterMeshRef} />
    </Canvas>
  )
}
