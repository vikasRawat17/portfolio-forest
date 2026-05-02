import { Animal } from './Animal'
import type { AnimalKind } from './Animal'
import type * as THREE from 'three'

interface AnimalDef { kind: AnimalKind; position: [number, number, number] }

const ANIMALS: AnimalDef[] = [
  { kind: 'deer',   position: [ 8,  1, -5]  },
  { kind: 'deer',   position: [-6,  1,  8]  },
  { kind: 'fox',    position: [25,  1, -10] },
  { kind: 'rabbit', position: [-18, 1, 10]  },
  { kind: 'rabbit', position: [-22, 1, 5]   },
  { kind: 'rabbit', position: [20,  1, 25]  },
  { kind: 'owl',    position: [32,  1, -18] },
  { kind: 'wolf',   position: [-40, 1, -35] },
]

interface Props { hunterRef: React.RefObject<THREE.Group | null> }

export function AnimalSpawner({ hunterRef }: Props) {
  return (
    <>
      {ANIMALS.map((a, i) => (
        <Animal key={i} kind={a.kind} position={a.position} hunterRef={hunterRef} />
      ))}
    </>
  )
}
