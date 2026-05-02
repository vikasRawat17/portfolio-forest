import { useMemo } from 'react'
import { RigidBody, CylinderCollider } from '@react-three/rapier'

function seededRandom(seed: number) {
  const x = Math.sin(seed) * 10000
  return x - Math.floor(x)
}

type TreeProps = { position: [number, number, number]; scale: number }

function PineTree({ position, scale }: TreeProps) {
  return (
    <RigidBody type="fixed" colliders={false} position={position}>
      <CylinderCollider args={[1 * scale, 0.25 * scale]} position={[0, 1 * scale, 0]} />
      <group scale={scale}>
        <mesh position={[0, 1, 0]} castShadow>
          <cylinderGeometry args={[0.15, 0.25, 2, 6]} />
          <meshStandardMaterial color="#3d2510" roughness={0.9} />
        </mesh>
        <mesh position={[0, 3, 0]} castShadow>
          <coneGeometry args={[1.4, 2.5, 7]} />
          <meshStandardMaterial color="#0d2208" roughness={0.8} />
        </mesh>
        <mesh position={[0, 4.2, 0]} castShadow>
          <coneGeometry args={[1.0, 2, 7]} />
          <meshStandardMaterial color="#0f2a0a" roughness={0.8} />
        </mesh>
        <mesh position={[0, 5.2, 0]} castShadow>
          <coneGeometry args={[0.65, 1.6, 7]} />
          <meshStandardMaterial color="#112d0c" roughness={0.8} />
        </mesh>
      </group>
    </RigidBody>
  )
}

function Rock({ position, scale }: TreeProps) {
  return (
    <RigidBody type="fixed" colliders="hull" position={position}>
      <mesh scale={scale} castShadow receiveShadow>
        <dodecahedronGeometry args={[0.6, 0]} />
        <meshStandardMaterial color="#2a2a2a" roughness={0.95} />
      </mesh>
    </RigidBody>
  )
}

export function Vegetation() {
  const trees = useMemo<TreeProps[]>(() => {
    const result: TreeProps[] = []
    for (let i = 0; i < 60; i++) {
      const angle = seededRandom(i * 7.3) * Math.PI * 2
      const radius = 10 + seededRandom(i * 3.1) * 48
      const x = Math.cos(angle) * radius
      const z = Math.sin(angle) * radius
      if (Math.abs(x) < 8 && Math.abs(z) < 8) continue
      result.push({
        position: [x, 0, z],
        scale: 0.8 + seededRandom(i * 5.7) * 0.8,
      })
    }
    return result
  }, [])

  const rocks = useMemo<TreeProps[]>(() => {
    return Array.from({ length: 25 }, (_, i) => {
      const s = 0.5 + seededRandom(i * 4.3) * 1.5
      return {
        position: [
          (seededRandom(i * 11.1) - 0.5) * 90,
          0.6 * s,
          (seededRandom(i * 9.7) - 0.5) * 90,
        ],
        scale: s,
      }
    })
  }, [])

  return (
    <>
      {trees.map((t, i) => <PineTree key={i} {...t} />)}
      {rocks.map((r, i) => <Rock key={i} {...r} />)}
    </>
  )
}
