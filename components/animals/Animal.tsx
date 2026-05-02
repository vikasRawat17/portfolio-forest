import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { RigidBody, CapsuleCollider } from '@react-three/rapier'
import type { RapierRigidBody } from '@react-three/rapier'
import * as THREE from 'three'

export type AnimalKind = 'deer' | 'fox' | 'rabbit' | 'owl' | 'wolf'

const ANIMAL_CONFIG: Record<AnimalKind, {
  color: string; size: [number, number]; speed: number; fleeRadius: number
}> = {
  deer:   { color: '#8B5A2B', size: [0.35, 0.7],  speed: 7, fleeRadius: 8 },
  fox:    { color: '#C05A1F', size: [0.2,  0.4],  speed: 8, fleeRadius: 8 },
  rabbit: { color: '#A0836A', size: [0.15, 0.25], speed: 6, fleeRadius: 8 },
  owl:    { color: '#5A4A2A', size: [0.2,  0.3],  speed: 5, fleeRadius: 3 },
  wolf:   { color: '#4A4A4A', size: [0.3,  0.6],  speed: 9, fleeRadius: 8 },
}

type State = 'idle' | 'flee'

interface Props {
  kind: AnimalKind
  position: [number, number, number]
  hunterRef: React.RefObject<THREE.Group | null>
}

const _hunterPos = new THREE.Vector3()
const _animalPos = new THREE.Vector3()
const _awayDir = new THREE.Vector2()

export function Animal({ kind, position, hunterRef }: Props) {
  const rbRef       = useRef<RapierRigidBody>(null)
  const cfg         = ANIMAL_CONFIG[kind]
  const state       = useRef<State>('idle')
  const fleeTimer   = useRef(0)
  const wanderTimer = useRef(Math.random() * 3)
  const wanderDir   = useRef(new THREE.Vector2(0, 0))

  useFrame((_, delta) => {
    const rb = rbRef.current
    if (!rb) return

    const pos = rb.translation()
    _animalPos.set(pos.x, pos.y, pos.z)

    if (hunterRef.current) {
      hunterRef.current.getWorldPosition(_hunterPos)
    }
    const dist = _animalPos.distanceTo(_hunterPos)

    if (dist < cfg.fleeRadius && state.current === 'idle') {
      state.current = 'flee'
      fleeTimer.current = 3
      _awayDir.set(pos.x - _hunterPos.x, pos.z - _hunterPos.z).normalize()
      const offset = (Math.random() - 0.5) * Math.PI * 0.5
      const angle = Math.atan2(_awayDir.x, _awayDir.y) + offset
      wanderDir.current.set(Math.sin(angle), Math.cos(angle))
    }

    if (state.current === 'flee') {
      fleeTimer.current -= delta
      rb.setLinvel({ x: wanderDir.current.x * cfg.speed, y: rb.linvel().y, z: wanderDir.current.y * cfg.speed }, true)
      if (fleeTimer.current <= 0) state.current = 'idle'
      return
    }

    wanderTimer.current -= delta
    if (wanderTimer.current <= 0) {
      const angle = Math.random() * Math.PI * 2
      wanderDir.current.set(Math.sin(angle), Math.cos(angle))
      wanderTimer.current = 2 + Math.random() * 3
    }
    rb.setLinvel({ x: wanderDir.current.x * 0.8, y: rb.linvel().y, z: wanderDir.current.y * 0.8 }, true)
  })

  return (
    <RigidBody
      ref={rbRef}
      colliders={false}
      mass={1}
      lockRotations
      position={position}
    >
      <CapsuleCollider args={cfg.size} />
      <mesh castShadow>
        <capsuleGeometry args={[cfg.size[0], cfg.size[1], 4, 8]} />
        <meshStandardMaterial color={cfg.color} roughness={0.8} />
      </mesh>
    </RigidBody>
  )
}
