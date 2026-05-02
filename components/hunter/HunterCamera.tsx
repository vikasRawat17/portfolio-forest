import { useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

interface Props {
  targetRef: React.RefObject<THREE.Group | null>
}

const OFFSET = new THREE.Vector3(0, 5, 9)
const LOOK_OFFSET = new THREE.Vector3(0, 1.2, 0)
const LERP_FACTOR = 0.06

export function HunterCamera({ targetRef }: Props) {
  const { camera } = useThree()
  const currentPos = useRef(new THREE.Vector3(0, 5, 9))
  const currentLook = useRef(new THREE.Vector3(0, 1, 0))

  useFrame(() => {
    const target = targetRef.current
    if (!target) return

    const worldPos = new THREE.Vector3()
    target.getWorldPosition(worldPos)

    const desiredPos = worldPos.clone().add(OFFSET)
    const desiredLook = worldPos.clone().add(LOOK_OFFSET)

    currentPos.current.lerp(desiredPos, LERP_FACTOR)
    currentLook.current.lerp(desiredLook, LERP_FACTOR)

    camera.position.copy(currentPos.current)
    camera.lookAt(currentLook.current)
  })

  return null
}
