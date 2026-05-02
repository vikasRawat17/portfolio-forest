import { useRef, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { RigidBody, CapsuleCollider } from '@react-three/rapier'
import type { RapierRigidBody } from '@react-three/rapier'
import * as THREE from 'three'

const WALK_SPEED = 5
const SPRINT_SPEED = 9

const keys: Record<string, boolean> = {}

interface HunterProps {
  meshRef?: React.RefObject<THREE.Group | null>
}

export function Hunter({ meshRef: externalRef }: HunterProps = {}) {
  const rbRef = useRef<RapierRigidBody>(null)
  const internalRef = useRef<THREE.Group>(null)
  const meshRef = externalRef ?? internalRef

  useEffect(() => {
    const down = (e: KeyboardEvent) => { keys[e.code] = true }
    const up   = (e: KeyboardEvent) => { keys[e.code] = false }
    window.addEventListener('keydown', down)
    window.addEventListener('keyup', up)
    return () => {
      window.removeEventListener('keydown', down)
      window.removeEventListener('keyup', up)
    }
  }, [])

  useFrame(() => {
    const rb = rbRef.current
    const mesh = meshRef.current
    if (!rb || !mesh) return

    const speed = keys['ShiftLeft'] || keys['ShiftRight'] ? SPRINT_SPEED : WALK_SPEED
    const vel = rb.linvel()
    let dx = 0
    let dz = 0

    if (keys['KeyW'] || keys['ArrowUp'])    dz -= 1
    if (keys['KeyS'] || keys['ArrowDown'])  dz += 1
    if (keys['KeyA'] || keys['ArrowLeft'])  dx -= 1
    if (keys['KeyD'] || keys['ArrowRight']) dx += 1

    const dir = new THREE.Vector2(dx, dz)
    const moving = dir.length() > 0
    if (moving) dir.normalize()

    rb.setLinvel({ x: dir.x * speed, y: vel.y, z: dir.y * speed }, true)

    if (moving) {
      const angle = Math.atan2(dir.x, dir.y)
      mesh.rotation.y = THREE.MathUtils.lerp(mesh.rotation.y, angle, 0.15)
    }
  })

  return (
    <RigidBody
      ref={rbRef}
      colliders={false}
      mass={1}
      lockRotations
      position={[0, 1, 0]}
    >
      <CapsuleCollider args={[0.4, 0.3]} />
      <group ref={meshRef}>
        <mesh position={[0, 0, 0]} castShadow>
          <capsuleGeometry args={[0.3, 1.0, 4, 8]} />
          <meshStandardMaterial color="#5C3A1E" roughness={0.8} />
        </mesh>
        <mesh position={[0, 0.85, 0]} castShadow>
          <sphereGeometry args={[0.22, 8, 8]} />
          <meshStandardMaterial color="#8B6347" roughness={0.7} />
        </mesh>
        <mesh position={[0, 0.95, 0]} castShadow>
          <coneGeometry args={[0.25, 0.4, 8]} />
          <meshStandardMaterial color="#2a1a0a" roughness={0.9} />
        </mesh>
      </group>
    </RigidBody>
  )
}
