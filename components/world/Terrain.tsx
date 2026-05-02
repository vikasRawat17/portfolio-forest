import { RigidBody } from '@react-three/rapier'

export function Terrain() {
  return (
    <RigidBody type="fixed" colliders="cuboid">
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[120, 120, 32, 32]} />
        <meshStandardMaterial
          color="#1a2e0f"
          roughness={0.9}
          metalness={0}
        />
      </mesh>
    </RigidBody>
  )
}
