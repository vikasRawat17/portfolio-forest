import { useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

interface Props {
  targetRef: React.RefObject<THREE.Group | null>
  enabled?: boolean
}

const OFFSET = new THREE.Vector3(0, 5, 9)
const LOOK_OFFSET = new THREE.Vector3(0, 1.2, 0)
const LERP_FACTOR = 0.06

export function HunterCamera({ targetRef, enabled = true }: Props) {
  const { camera } = useThree()
  const currentPos = useRef(new THREE.Vector3(0, 5, 9))
  const currentLook = useRef(new THREE.Vector3(0, 1, 0))
  const _worldPos = useRef(new THREE.Vector3())
  const _desiredPos = useRef(new THREE.Vector3())
  const _desiredLook = useRef(new THREE.Vector3())

  useFrame(() => {
    if (!enabled) return
    const target = targetRef.current
    if (!target) return

    target.getWorldPosition(_worldPos.current)
    _desiredPos.current.copy(_worldPos.current).add(OFFSET)
    _desiredLook.current.copy(_worldPos.current).add(LOOK_OFFSET)

    currentPos.current.lerp(_desiredPos.current, LERP_FACTOR)
    currentLook.current.lerp(_desiredLook.current, LERP_FACTOR)

    camera.position.copy(currentPos.current)
    camera.lookAt(currentLook.current)
  })

  return null
}
