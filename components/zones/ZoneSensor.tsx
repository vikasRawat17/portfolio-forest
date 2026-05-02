import { RigidBody, CuboidCollider } from '@react-three/rapier'
import { useGameStore } from '@/lib/store'
import type { ZoneId } from '@/lib/store'

interface Props {
  id: ZoneId
  position: [number, number, number]
  size: [number, number, number]
}

export function ZoneSensor({ id, position, size }: Props) {
  const setActiveZone = useGameStore((s) => s.setActiveZone)

  return (
    <RigidBody type="fixed" sensor position={position}
      onIntersectionEnter={() => setActiveZone(id)}
      onIntersectionExit={() => setActiveZone(null)}
    >
      <CuboidCollider args={size} />
    </RigidBody>
  )
}
