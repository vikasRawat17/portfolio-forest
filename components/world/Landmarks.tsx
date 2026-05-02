import { RigidBody } from '@react-three/rapier'

function Cabin() {
  return (
    <RigidBody type="fixed" colliders="cuboid" position={[0, 0, 0]}>
      <group>
        <mesh position={[0, 1.5, 0]} castShadow receiveShadow>
          <boxGeometry args={[6, 3, 5]} />
          <meshStandardMaterial color="#3d2510" roughness={0.9} />
        </mesh>
        <mesh position={[0, 3.5, 0]} castShadow>
          <coneGeometry args={[4.5, 2, 4]} />
          <meshStandardMaterial color="#2a1a08" roughness={0.95} />
        </mesh>
        <pointLight position={[0, 1.5, 0]} color="#ff9966" intensity={2} distance={12} decay={2} />
      </group>
    </RigidBody>
  )
}

function Ruins() {
  return (
    <RigidBody type="fixed" colliders="cuboid" position={[40, 0, -15]}>
      <group>
        {[[-2, 0, -2], [2, 0, -2], [-2, 0, 2], [2, 0, 2]].map(([x, , z], i) => (
          <mesh key={i} position={[x as number, 2, z as number]} castShadow>
            <cylinderGeometry args={[0.4, 0.5, 4 - i * 0.3, 8]} />
            <meshStandardMaterial color="#5a5040" roughness={0.95} />
          </mesh>
        ))}
        <pointLight position={[0, 1, 0]} color="#6644aa" intensity={1.5} distance={15} decay={2} />
      </group>
    </RigidBody>
  )
}

function WaterfallShrine() {
  return (
    <group position={[0, 0, -45]}>
      <RigidBody type="fixed" colliders="cuboid">
        <mesh position={[0, 4, -3]} castShadow>
          <boxGeometry args={[12, 8, 2]} />
          <meshStandardMaterial color="#2a2a2a" roughness={0.95} />
        </mesh>
      </RigidBody>
      <mesh position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[6, 8]} />
        <meshStandardMaterial color="#2255aa" transparent opacity={0.6} roughness={0} metalness={0.3} />
      </mesh>
      <pointLight position={[0, 3, 0]} color="#5566ff" intensity={2} distance={20} decay={2} />
    </group>
  )
}

function MushroomGrove() {
  const shrooms: [number, number, number][] = [[-2, 0, 0], [2, 0, -1], [0, 0, 2], [-1, 0, -2], [3, 0, 1]]
  return (
    <group position={[-35, 0, -20]}>
      {shrooms.map(([x, , z], i) => (
        <group key={i} position={[x, 0, z]}>
          <mesh position={[0, 0.8, 0]} castShadow>
            <cylinderGeometry args={[0.15, 0.2, 1.6, 6]} />
            <meshStandardMaterial color="#c8a070" roughness={0.8} />
          </mesh>
          <mesh position={[0, 1.8, 0]} castShadow>
            <sphereGeometry args={[0.7, 8, 6]} />
            <meshStandardMaterial color="#c82020" roughness={0.7} emissive="#220000" emissiveIntensity={0.3} />
          </mesh>
        </group>
      ))}
      <pointLight position={[0, 2, 0]} color="#44ff88" intensity={1.5} distance={14} decay={2} />
    </group>
  )
}

function FireflyClearing() {
  return (
    <group position={[35, 0, 30]}>
      <pointLight position={[0, 2, 0]} color="#ffee44" intensity={1} distance={18} decay={2} />
    </group>
  )
}

function Campfire() {
  return (
    <group position={[0, 0, 35]}>
      {Array.from({ length: 8 }, (_, i) => {
        const a = (i / 8) * Math.PI * 2
        return (
          <mesh key={i} position={[Math.cos(a) * 1.2, 0.2, Math.sin(a) * 1.2]} castShadow>
            <dodecahedronGeometry args={[0.3, 0]} />
            <meshStandardMaterial color="#444" roughness={0.95} />
          </mesh>
        )
      })}
      <mesh position={[0, 0.15, 0]} rotation={[0, 0.8, 0]} castShadow>
        <cylinderGeometry args={[0.12, 0.12, 1.8, 6]} />
        <meshStandardMaterial color="#2a1808" roughness={0.9} />
      </mesh>
      <mesh position={[0, 0.15, 0]} rotation={[0, -0.4, 0]} castShadow>
        <cylinderGeometry args={[0.12, 0.12, 1.8, 6]} />
        <meshStandardMaterial color="#2a1808" roughness={0.9} />
      </mesh>
      <pointLight position={[0, 0.8, 0]} color="#ff5500" intensity={3} distance={15} decay={2} />
      <pointLight position={[0, 0.8, 0]} color="#ff8800" intensity={1.5} distance={8} decay={2} />
    </group>
  )
}

export function Landmarks() {
  return (
    <>
      <Cabin />
      <Ruins />
      <WaterfallShrine />
      <MushroomGrove />
      <FireflyClearing />
      <Campfire />
    </>
  )
}
