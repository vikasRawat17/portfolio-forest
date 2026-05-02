# Forest Portfolio Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build an interactive 3D forest portfolio where visitors explore as a hunter, discovering 6 landmark zones each containing a portfolio section, with physics-driven animals, random weather cycles, and ambient audio.

**Architecture:** Next.js 16 App Router shell with a client-only R3F canvas. Zustand manages all game state (weather, active zone, mute). GSAP handles camera transitions and panel animations. Rapier drives all physics (hunter, animals, environment). Howler.js manages layered ambient audio.

**Tech Stack:** Next.js 16, React 19, @react-three/fiber, @react-three/drei, @react-three/rapier, zustand, gsap, howler, three, TypeScript 5, Tailwind 4, vitest

---

## Phase 1 — Setup

### Task 1: Install dependencies + configure project

**Files:**
- Modify: `package.json`
- Modify: `next.config.ts`
- Create: `vitest.config.ts`
- Modify: `.gitignore`

- [ ] **Step 1: Install all runtime deps**

```bash
npm install three @react-three/fiber @react-three/drei @react-three/rapier zustand gsap howler
```

- [ ] **Step 2: Install dev deps**

```bash
npm install -D @types/three vitest @vitest/ui happy-dom
```

- [ ] **Step 3: Read Next.js 16 docs before touching next.config.ts**

```bash
ls node_modules/next/dist/docs/
```

Read any docs covering App Router, webpack config, and WASM support.

- [ ] **Step 4: Update `next.config.ts` for Rapier WASM**

```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config) => {
    config.experiments = { ...config.experiments, asyncWebAssembly: true };
    config.module.rules.push({
      test: /\.wasm$/,
      type: "webassembly/async",
    });
    return config;
  },
};

export default nextConfig;
```

- [ ] **Step 5: Create `vitest.config.ts`**

```ts
import { defineConfig } from 'vitest/config'
import { resolve } from 'path'

export default defineConfig({
  test: {
    environment: 'happy-dom',
    globals: true,
  },
  resolve: {
    alias: { '@': resolve(__dirname, './') },
  },
})
```

- [ ] **Step 6: Add test script to `package.json`**

```json
"scripts": {
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "eslint",
  "test": "vitest run",
  "test:watch": "vitest"
}
```

- [ ] **Step 7: Add `.superpowers/` to `.gitignore`**

Append to `.gitignore`:
```
.superpowers/
```

- [ ] **Step 8: Verify install**

```bash
npm run dev
```

Expected: dev server starts on localhost:3000 with no errors.

- [ ] **Step 9: Commit**

```bash
git add package.json package-lock.json next.config.ts vitest.config.ts .gitignore
git commit -m "chore: install R3F, Rapier, Zustand, GSAP, Howler; add vitest"
```

---

### Task 2: Zustand store

**Files:**
- Create: `lib/store.ts`
- Create: `lib/store.test.ts`

- [ ] **Step 1: Write failing tests**

Create `lib/store.test.ts`:

```ts
import { describe, it, expect, beforeEach } from 'vitest'
import { useGameStore } from './store'

beforeEach(() => {
  useGameStore.setState({
    weather: 'clear',
    activeZone: null,
    enteredZone: null,
    muted: false,
    loaded: false,
  })
})

describe('weather', () => {
  it('sets weather state', () => {
    useGameStore.getState().setWeather('rain')
    expect(useGameStore.getState().weather).toBe('rain')
  })
})

describe('zones', () => {
  it('sets active zone', () => {
    useGameStore.getState().setActiveZone('cabin')
    expect(useGameStore.getState().activeZone).toBe('cabin')
  })

  it('enterZone sets enteredZone', () => {
    useGameStore.getState().enterZone('ruins')
    expect(useGameStore.getState().enteredZone).toBe('ruins')
  })

  it('exitZone clears enteredZone', () => {
    useGameStore.getState().enterZone('ruins')
    useGameStore.getState().exitZone()
    expect(useGameStore.getState().enteredZone).toBeNull()
  })
})

describe('mute', () => {
  it('toggles muted', () => {
    useGameStore.getState().toggleMute()
    expect(useGameStore.getState().muted).toBe(true)
    useGameStore.getState().toggleMute()
    expect(useGameStore.getState().muted).toBe(false)
  })
})

describe('loaded', () => {
  it('setLoaded sets loaded to true', () => {
    useGameStore.getState().setLoaded()
    expect(useGameStore.getState().loaded).toBe(true)
  })
})
```

- [ ] **Step 2: Run tests — expect failure**

```bash
npm test
```

Expected: FAIL — `Cannot find module './store'`

- [ ] **Step 3: Create `lib/store.ts`**

```ts
import { create } from 'zustand'

export type WeatherState = 'clear' | 'fog' | 'rain' | 'storm'
export type ZoneId = 'cabin' | 'ruins' | 'waterfall' | 'grove' | 'firefly' | 'campfire' | null

interface GameStore {
  weather: WeatherState
  setWeather: (w: WeatherState) => void
  activeZone: ZoneId
  enteredZone: ZoneId
  setActiveZone: (z: ZoneId) => void
  enterZone: (z: ZoneId) => void
  exitZone: () => void
  muted: boolean
  toggleMute: () => void
  loaded: boolean
  setLoaded: () => void
}

export const useGameStore = create<GameStore>((set) => ({
  weather: 'clear',
  setWeather: (weather) => set({ weather }),
  activeZone: null,
  enteredZone: null,
  setActiveZone: (activeZone) => set({ activeZone }),
  enterZone: (enteredZone) => set({ enteredZone }),
  exitZone: () => set({ enteredZone: null }),
  muted: false,
  toggleMute: () => set((s) => ({ muted: !s.muted })),
  loaded: false,
  setLoaded: () => set({ loaded: true }),
}))
```

- [ ] **Step 4: Run tests — expect pass**

```bash
npm test
```

Expected: all 7 tests PASS

- [ ] **Step 5: Commit**

```bash
git add lib/store.ts lib/store.test.ts
git commit -m "feat: zustand game store with weather, zone, mute, loaded state"
```

---

### Task 3: Weather cycle

**Files:**
- Create: `lib/weatherCycle.ts`
- Create: `lib/weatherCycle.test.ts`

- [ ] **Step 1: Write failing tests**

Create `lib/weatherCycle.test.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { randomNext, WEATHER_STATES } from './weatherCycle'
import type { WeatherState } from './store'

describe('randomNext', () => {
  it('never returns current state', () => {
    WEATHER_STATES.forEach((state) => {
      for (let i = 0; i < 50; i++) {
        expect(randomNext(state)).not.toBe(state)
      }
    })
  })

  it('always returns a valid WeatherState', () => {
    WEATHER_STATES.forEach((state) => {
      expect(WEATHER_STATES).toContain(randomNext(state))
    })
  })
})
```

- [ ] **Step 2: Run — expect failure**

```bash
npm test
```

Expected: FAIL — cannot find module

- [ ] **Step 3: Create `lib/weatherCycle.ts`**

```ts
import type { WeatherState } from './store'
import { useGameStore } from './store'

export const WEATHER_STATES: WeatherState[] = ['clear', 'fog', 'rain', 'storm']

const MIN_MS = 60_000
const MAX_MS = 180_000

export function randomNext(current: WeatherState): WeatherState {
  const others = WEATHER_STATES.filter((s) => s !== current)
  return others[Math.floor(Math.random() * others.length)]
}

let timer: ReturnType<typeof setTimeout> | null = null

export function startWeatherCycle(): void {
  function tick() {
    const { weather, setWeather } = useGameStore.getState()
    setWeather(randomNext(weather))
    timer = setTimeout(tick, MIN_MS + Math.random() * (MAX_MS - MIN_MS))
  }
  timer = setTimeout(tick, MIN_MS + Math.random() * (MAX_MS - MIN_MS))
}

export function stopWeatherCycle(): void {
  if (timer) clearTimeout(timer)
  timer = null
}
```

- [ ] **Step 4: Run tests — expect pass**

```bash
npm test
```

Expected: all tests PASS

- [ ] **Step 5: Commit**

```bash
git add lib/weatherCycle.ts lib/weatherCycle.test.ts
git commit -m "feat: random weather cycle state machine"
```

---

## Phase 2 — World Foundation

### Task 4: R3F canvas + terrain

**Files:**
- Modify: `app/page.tsx`
- Modify: `app/layout.tsx`
- Create: `components/world/ForestWorld.tsx`
- Create: `components/world/Terrain.tsx`

- [ ] **Step 1: Update `app/layout.tsx` — load fonts**

```tsx
import type { Metadata } from 'next'
import { Space_Grotesk, Inter, JetBrains_Mono } from 'next/font/google'
import './globals.css'

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-display',
})
const inter = Inter({ subsets: ['latin'], variable: '--font-body' })
const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
})

export const metadata: Metadata = {
  title: 'Vikas Singh Rawat — Full-Stack Engineer',
  description:
    'Full-stack engineer at Outbox Labs. Building ColdStats, shipping ReachInbox. Open to opportunities.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${spaceGrotesk.variable} ${inter.variable} ${jetbrainsMono.variable}`}>
        {children}
      </body>
    </html>
  )
}
```

- [ ] **Step 2: Update `app/globals.css`**

```css
@import "tailwindcss";

:root {
  --canvas: #08080c;
  --canvas2: #0b0b11;
  --surface: #0f0f14;
  --raised: #16161e;
  --fg: #f5f5f7;
  --muted: #a0a0aa;
  --subtle: #60606a;
  --g1: #ff7a3d;
  --g2: #e11d74;
  --g3: #5b3df5;
  --border: rgba(255, 255, 255, 0.08);
  --gradient: linear-gradient(120deg, #ff7a3d 0%, #e11d74 50%, #5b3df5 100%);
}

* { box-sizing: border-box; margin: 0; padding: 0; }

html, body, #__next { width: 100%; height: 100%; overflow: hidden; background: var(--canvas); }
```

- [ ] **Step 3: Update `app/page.tsx`**

```tsx
'use client'
import dynamic from 'next/dynamic'

const ForestWorld = dynamic(() => import('@/components/world/ForestWorld'), {
  ssr: false,
  loading: () => (
    <div style={{ width: '100vw', height: '100vh', background: '#08080c' }} />
  ),
})

export default function Home() {
  return <ForestWorld />
}
```

- [ ] **Step 4: Create `components/world/Terrain.tsx`**

```tsx
import { RigidBody } from '@react-three/rapier'
import * as THREE from 'three'

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
```

- [ ] **Step 5: Create `components/world/ForestWorld.tsx`**

```tsx
'use client'
import { Canvas } from '@react-three/fiber'
import { Physics } from '@react-three/rapier'
import { Terrain } from './Terrain'

export default function ForestWorld() {
  return (
    <Canvas
      shadows
      camera={{ fov: 60, near: 0.1, far: 400 }}
      style={{ width: '100vw', height: '100vh', background: '#08080c' }}
    >
      <ambientLight intensity={0.3} color="#4466aa" />
      <directionalLight
        position={[20, 40, 10]}
        intensity={0.8}
        color="#8899cc"
        castShadow
        shadow-mapSize={[2048, 2048]}
      />
      <Physics gravity={[0, -20, 0]}>
        <Terrain />
      </Physics>
    </Canvas>
  )
}
```

- [ ] **Step 6: Run dev server and verify**

```bash
npm run dev
```

Open http://localhost:3000. Expected: dark screen with a flat dark-green plane visible.

- [ ] **Step 7: Commit**

```bash
git add app/page.tsx app/layout.tsx app/globals.css components/world/ForestWorld.tsx components/world/Terrain.tsx
git commit -m "feat: R3F canvas with Physics world and terrain"
```

---

### Task 5: Sky + atmosphere

**Files:**
- Create: `components/world/SkyDome.tsx`
- Modify: `components/world/ForestWorld.tsx`

- [ ] **Step 1: Create `components/world/SkyDome.tsx`**

```tsx
import { Sky, Stars } from '@react-three/drei'
import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGameStore } from '@/lib/store'
import * as THREE from 'three'
import type { WeatherState } from '@/lib/store'

const SKY_CONFIG: Record<WeatherState, {
  sunPosition: [number, number, number]
  turbidity: number
  rayleigh: number
  starsOpacity: number
  ambientColor: string
  ambientIntensity: number
}> = {
  clear:  { sunPosition: [-20, -2, 10], turbidity: 8,  rayleigh: 0.5, starsOpacity: 1,   ambientColor: '#334488', ambientIntensity: 0.35 },
  fog:    { sunPosition: [-20, -2, 10], turbidity: 20, rayleigh: 2,   starsOpacity: 0,   ambientColor: '#223322', ambientIntensity: 0.2  },
  rain:   { sunPosition: [-20, -3, 10], turbidity: 25, rayleigh: 3,   starsOpacity: 0,   ambientColor: '#1a2233', ambientIntensity: 0.15 },
  storm:  { sunPosition: [-20, -4, 10], turbidity: 30, rayleigh: 4,   starsOpacity: 0,   ambientColor: '#111122', ambientIntensity: 0.1  },
}

export function SkyDome() {
  const weather = useGameStore((s) => s.weather)
  const cfg = SKY_CONFIG[weather]

  return (
    <>
      <Sky
        distance={450}
        sunPosition={cfg.sunPosition}
        turbidity={cfg.turbidity}
        rayleigh={cfg.rayleigh}
        mieCoefficient={0.005}
        mieDirectionalG={0.8}
      />
      <Stars
        radius={100}
        depth={50}
        count={3000}
        factor={4}
        fade
        speed={0}
        saturation={0}
      />
      <ambientLight color={cfg.ambientColor} intensity={cfg.ambientIntensity} />
    </>
  )
}
```

- [ ] **Step 2: Add `SkyDome` to `ForestWorld.tsx`**

```tsx
'use client'
import { Canvas } from '@react-three/fiber'
import { Physics } from '@react-three/rapier'
import { Terrain } from './Terrain'
import { SkyDome } from './SkyDome'

export default function ForestWorld() {
  return (
    <Canvas
      shadows
      camera={{ fov: 60, near: 0.1, far: 400 }}
      style={{ width: '100vw', height: '100vh', background: '#08080c' }}
    >
      <SkyDome />
      <directionalLight
        position={[20, 40, 10]}
        intensity={0.8}
        color="#8899cc"
        castShadow
        shadow-mapSize={[2048, 2048]}
      />
      <Physics gravity={[0, -20, 0]}>
        <Terrain />
      </Physics>
    </Canvas>
  )
}
```

- [ ] **Step 3: Run dev — verify dark night sky with stars visible over terrain**

```bash
npm run dev
```

Expected: dark sky, stars, terrain plane visible.

- [ ] **Step 4: Commit**

```bash
git add components/world/SkyDome.tsx components/world/ForestWorld.tsx
git commit -m "feat: dynamic sky dome driven by weather state"
```

---

### Task 6: Instanced vegetation

**Files:**
- Create: `components/world/Vegetation.tsx`
- Modify: `components/world/ForestWorld.tsx`

- [ ] **Step 1: Create `components/world/Vegetation.tsx`**

```tsx
import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { RigidBody } from '@react-three/rapier'
import * as THREE from 'three'

// Deterministic pseudo-random to keep positions stable across renders
function seededRandom(seed: number) {
  const x = Math.sin(seed) * 10000
  return x - Math.floor(x)
}

type TreeProps = { position: [number, number, number]; scale: number }

function PineTree({ position, scale }: TreeProps) {
  return (
    <RigidBody type="fixed" colliders="cylinder" position={position}>
      <group scale={scale}>
        {/* Trunk */}
        <mesh position={[0, 1, 0]} castShadow>
          <cylinderGeometry args={[0.15, 0.25, 2, 6]} />
          <meshStandardMaterial color="#3d2510" roughness={0.9} />
        </mesh>
        {/* Canopy layers */}
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
    <RigidBody type="fixed" colliders="cuboid" position={position}>
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
    // Avoid center area (cabin spawn) — skip within 12 units of origin
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
    return Array.from({ length: 25 }, (_, i) => ({
      position: [
        (seededRandom(i * 11.1) - 0.5) * 90,
        0.3,
        (seededRandom(i * 9.7) - 0.5) * 90,
      ],
      scale: 0.5 + seededRandom(i * 4.3) * 1.5,
    }))
  }, [])

  return (
    <>
      {trees.map((t, i) => <PineTree key={i} {...t} />)}
      {rocks.map((r, i) => <Rock key={i} {...r} />)}
    </>
  )
}
```

- [ ] **Step 2: Add `Vegetation` to `ForestWorld.tsx` inside `<Physics>`**

```tsx
import { Vegetation } from './Vegetation'
// inside <Physics>:
<Vegetation />
```

- [ ] **Step 3: Run dev — verify trees and rocks scattered across terrain**

Expected: pine trees and rocks visible, clear path around origin (cabin area).

- [ ] **Step 4: Commit**

```bash
git add components/world/Vegetation.tsx components/world/ForestWorld.tsx
git commit -m "feat: instanced pine trees and rocks with Rapier colliders"
```

---

## Phase 3 — Hunter + Camera

### Task 7: Hunter character + WASD + physics

**Files:**
- Create: `components/hunter/Hunter.tsx`
- Modify: `components/world/ForestWorld.tsx`

- [ ] **Step 1: Create `components/hunter/Hunter.tsx`**

```tsx
'use client'
import { useRef, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { RigidBody, CapsuleCollider } from '@react-three/rapier'
import type { RapierRigidBody } from '@react-three/rapier'
import * as THREE from 'three'

const WALK_SPEED = 5
const SPRINT_SPEED = 9

const keys: Record<string, boolean> = {}

export function Hunter() {
  const rbRef = useRef<RapierRigidBody>(null)
  const meshRef = useRef<THREE.Group>(null)

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
    if (dir.length() > 0) dir.normalize()

    rb.setLinvel({ x: dir.x * speed, y: vel.y, z: dir.y * speed }, true)

    // Rotate mesh to face movement direction
    if (dir.length() > 0) {
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
      <CapsuleCollider args={[0.5, 0.4]} />
      <group ref={meshRef}>
        {/* Placeholder hunter body — replaced by .glb in Phase 6 */}
        <mesh position={[0, 0, 0]} castShadow>
          <capsuleGeometry args={[0.3, 1.0, 4, 8]} />
          <meshStandardMaterial color="#5C3A1E" roughness={0.8} />
        </mesh>
        {/* Head */}
        <mesh position={[0, 0.85, 0]} castShadow>
          <sphereGeometry args={[0.22, 8, 8]} />
          <meshStandardMaterial color="#8B6347" roughness={0.7} />
        </mesh>
        {/* Hood */}
        <mesh position={[0, 0.95, 0]} castShadow>
          <coneGeometry args={[0.25, 0.4, 8]} />
          <meshStandardMaterial color="#2a1a0a" roughness={0.9} />
        </mesh>
      </group>
    </RigidBody>
  )
}
```

- [ ] **Step 2: Add `Hunter` to `ForestWorld.tsx`**

```tsx
import { Hunter } from '@/components/hunter/Hunter'
// inside <Physics>:
<Hunter />
```

- [ ] **Step 3: Run dev — WASD moves hunter on terrain**

Expected: hunter capsule visible at origin, WASD moves it, can't fall through terrain.

- [ ] **Step 4: Commit**

```bash
git add components/hunter/Hunter.tsx components/world/ForestWorld.tsx
git commit -m "feat: hunter character with WASD + Rapier physics"
```

---

### Task 8: Third-person spring camera

**Files:**
- Create: `components/hunter/HunterCamera.tsx`
- Modify: `components/world/ForestWorld.tsx`

- [ ] **Step 1: Create `components/hunter/HunterCamera.tsx`**

```tsx
import { useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

// Receives hunter world position as prop
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
```

- [ ] **Step 2: Update `Hunter.tsx` to expose meshRef via prop**

```tsx
// Add to Hunter.tsx props:
interface HunterProps {
  meshRef?: React.RefObject<THREE.Group | null>
}

export function Hunter({ meshRef: externalRef }: HunterProps = {}) {
  const internalRef = useRef<THREE.Group>(null)
  const meshRef = externalRef ?? internalRef
  // rest of component unchanged
}
```

- [ ] **Step 3: Update `ForestWorld.tsx` to wire camera**

```tsx
'use client'
import { useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { Physics } from '@react-three/rapier'
import * as THREE from 'three'
import { Terrain } from './Terrain'
import { SkyDome } from './SkyDome'
import { Vegetation } from './Vegetation'
import { Hunter } from '@/components/hunter/Hunter'
import { HunterCamera } from '@/components/hunter/HunterCamera'

export default function ForestWorld() {
  const hunterMeshRef = useRef<THREE.Group>(null)

  return (
    <Canvas
      shadows
      camera={{ fov: 60, near: 0.1, far: 400, position: [0, 5, 9] }}
      style={{ width: '100vw', height: '100vh', background: '#08080c' }}
    >
      <SkyDome />
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
      </Physics>
      <HunterCamera targetRef={hunterMeshRef} />
    </Canvas>
  )
}
```

- [ ] **Step 4: Run dev — camera follows hunter with spring lag**

Expected: WASD moves hunter, camera follows from behind/above with cinematic lag.

- [ ] **Step 5: Commit**

```bash
git add components/hunter/HunterCamera.tsx components/hunter/Hunter.tsx components/world/ForestWorld.tsx
git commit -m "feat: spring third-person camera following hunter"
```

---

## Phase 4 — Weather + Animals

### Task 9: Weather visual transitions

**Files:**
- Modify: `components/world/SkyDome.tsx`
- Create: `components/world/WeatherFog.tsx`
- Create: `components/world/WeatherParticles.tsx`
- Modify: `components/world/ForestWorld.tsx`

- [ ] **Step 1: Add smooth lerp to `SkyDome.tsx` via useFrame**

Replace `SkyDome.tsx` content:

```tsx
import { Sky, Stars } from '@react-three/drei'
import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGameStore } from '@/lib/store'
import * as THREE from 'three'
import type { WeatherState } from '@/lib/store'

const TARGET: Record<WeatherState, { turbidity: number; rayleigh: number; starsOpacity: number }> = {
  clear: { turbidity: 8,  rayleigh: 0.5, starsOpacity: 1   },
  fog:   { turbidity: 20, rayleigh: 2,   starsOpacity: 0   },
  rain:  { turbidity: 25, rayleigh: 3,   starsOpacity: 0   },
  storm: { turbidity: 30, rayleigh: 4,   starsOpacity: 0   },
}

export function SkyDome() {
  const weather = useGameStore((s) => s.weather)
  const t = TARGET[weather]
  const current = useRef({ turbidity: 8, rayleigh: 0.5 })

  useFrame((_, delta) => {
    const speed = delta * 0.4 // 8s full transition at 30fps
    current.current.turbidity += (t.turbidity - current.current.turbidity) * speed
    current.current.rayleigh  += (t.rayleigh  - current.current.rayleigh)  * speed
  })

  return (
    <>
      <Sky
        distance={450}
        sunPosition={[-20, -2, 10]}
        turbidity={current.current.turbidity}
        rayleigh={current.current.rayleigh}
        mieCoefficient={0.005}
        mieDirectionalG={0.8}
      />
      <Stars radius={100} depth={50} count={3000} factor={4} fade speed={0} saturation={0} />
    </>
  )
}
```

- [ ] **Step 2: Create `components/world/WeatherFog.tsx`**

```tsx
import { useFrame } from '@react-three/fiber'
import { useThree } from '@react-three/fiber'
import { useRef } from 'react'
import { useGameStore } from '@/lib/store'
import * as THREE from 'three'
import type { WeatherState } from '@/lib/store'

const FOG_TARGET: Record<WeatherState, { near: number; far: number; color: string }> = {
  clear: { near: 80,  far: 200, color: '#060c15' },
  fog:   { near: 8,   far: 35,  color: '#0d1a10' },
  rain:  { near: 30,  far: 90,  color: '#0a0f18' },
  storm: { near: 15,  far: 50,  color: '#070710' },
}

export function WeatherFog() {
  const { scene } = useThree()
  const weather = useGameStore((s) => s.weather)
  const target = FOG_TARGET[weather]
  const current = useRef({ near: 80, far: 200 })

  useFrame((_, delta) => {
    const s = delta * 0.4
    current.current.near += (target.near - current.current.near) * s
    current.current.far  += (target.far  - current.current.far)  * s

    if (!scene.fog) {
      scene.fog = new THREE.Fog(target.color, current.current.near, current.current.far)
    } else {
      ;(scene.fog as THREE.Fog).near = current.current.near
      ;(scene.fog as THREE.Fog).far  = current.current.far
    }
  })

  return null
}
```

- [ ] **Step 3: Create `components/world/WeatherParticles.tsx` (rain)**

```tsx
import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGameStore } from '@/lib/store'
import * as THREE from 'three'

const COUNT = 1500

export function WeatherParticles() {
  const weather = useGameStore((s) => s.weather)
  const ref = useRef<THREE.Points>(null)

  const positions = useMemo(() => {
    const arr = new Float32Array(COUNT * 3)
    for (let i = 0; i < COUNT; i++) {
      arr[i * 3]     = (Math.random() - 0.5) * 80
      arr[i * 3 + 1] = Math.random() * 40
      arr[i * 3 + 2] = (Math.random() - 0.5) * 80
    }
    return arr
  }, [])

  const isRaining = weather === 'rain' || weather === 'storm'

  useFrame((_, delta) => {
    const pts = ref.current
    if (!pts || !isRaining) return
    const pos = pts.geometry.attributes.position.array as Float32Array
    for (let i = 0; i < COUNT; i++) {
      pos[i * 3 + 1] -= delta * (weather === 'storm' ? 28 : 18)
      if (pos[i * 3 + 1] < 0) pos[i * 3 + 1] = 40
    }
    pts.geometry.attributes.position.needsUpdate = true
  })

  if (!isRaining) return null

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color="#aabbdd"
        size={0.06}
        transparent
        opacity={weather === 'storm' ? 0.7 : 0.45}
        sizeAttenuation
      />
    </points>
  )
}
```

- [ ] **Step 4: Add both to `ForestWorld.tsx`**

```tsx
import { WeatherFog } from './WeatherFog'
import { WeatherParticles } from './WeatherParticles'
// Add inside <Canvas>, outside <Physics>:
// <WeatherFog />
// <WeatherParticles />
```

- [ ] **Step 5: Wire weather cycle start in `ForestWorld.tsx`**

```tsx
import { useEffect } from 'react'
import { startWeatherCycle, stopWeatherCycle } from '@/lib/weatherCycle'

// In ForestWorld component, before return:
useEffect(() => {
  startWeatherCycle()
  return () => stopWeatherCycle()
}, [])
```

- [ ] **Step 6: Run dev — manually test weather by setting store in console**

Open browser console:
```js
// Trigger fog manually to verify
window.__zustand_test = () => {
  const s = document.querySelector('canvas').__r3f
}
// Or just wait ~60s for auto-cycle to trigger
```

Expected: weather changes gradually, fog rolls in/out, rain particles appear for rain/storm states.

- [ ] **Step 7: Commit**

```bash
git add components/world/SkyDome.tsx components/world/WeatherFog.tsx components/world/WeatherParticles.tsx components/world/ForestWorld.tsx
git commit -m "feat: weather visual system — fog, rain particles, sky lerp"
```

---

### Task 10: Animal system

**Files:**
- Create: `components/animals/Animal.tsx`
- Create: `components/animals/AnimalSpawner.tsx`
- Modify: `components/world/ForestWorld.tsx`

- [ ] **Step 1: Create `components/animals/Animal.tsx`**

```tsx
import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { RigidBody, CapsuleCollider } from '@react-three/rapier'
import type { RapierRigidBody } from '@react-three/rapier'
import * as THREE from 'three'

export type AnimalKind = 'deer' | 'fox' | 'rabbit' | 'owl' | 'wolf'

const ANIMAL_CONFIG: Record<AnimalKind, {
  color: string; size: [number, number]; speed: number; fleeRadius: number
}> = {
  deer:   { color: '#8B5A2B', size: [0.35, 0.7], speed: 7,  fleeRadius: 8  },
  fox:    { color: '#C05A1F', size: [0.2,  0.4], speed: 8,  fleeRadius: 8  },
  rabbit: { color: '#A0836A', size: [0.15, 0.25],speed: 6,  fleeRadius: 8  },
  owl:    { color: '#5A4A2A', size: [0.2,  0.3], speed: 5,  fleeRadius: 3  },
  wolf:   { color: '#4A4A4A', size: [0.3,  0.6], speed: 9,  fleeRadius: 8  },
}

type State = 'idle' | 'flee'

interface Props {
  kind: AnimalKind
  position: [number, number, number]
  hunterRef: React.RefObject<THREE.Group | null>
}

export function Animal({ kind, position, hunterRef }: Props) {
  const rbRef  = useRef<RapierRigidBody>(null)
  const cfg    = ANIMAL_CONFIG[kind]
  const state  = useRef<State>('idle')
  const fleeTimer  = useRef(0)
  const wanderTimer = useRef(Math.random() * 3)
  const wanderDir   = useRef(new THREE.Vector2(0, 0))

  useFrame((_, delta) => {
    const rb = rbRef.current
    const hunter = hunterRef.current
    if (!rb) return

    const pos = rb.translation()
    const hunterPos = new THREE.Vector3()
    hunter?.getWorldPosition(hunterPos)
    const dist = hunterPos.distanceTo(new THREE.Vector3(pos.x, pos.y, pos.z))

    // State transitions
    if (dist < cfg.fleeRadius && state.current === 'idle') {
      state.current = 'flee'
      fleeTimer.current = 3
      // Flee direction: away from hunter + offset
      const away = new THREE.Vector2(pos.x - hunterPos.x, pos.z - hunterPos.z).normalize()
      const offset = (Math.random() - 0.5) * Math.PI * 0.5
      const angle = Math.atan2(away.x, away.y) + offset
      wanderDir.current.set(Math.sin(angle), Math.cos(angle))
    }

    if (state.current === 'flee') {
      fleeTimer.current -= delta
      rb.setLinvel({ x: wanderDir.current.x * cfg.speed, y: rb.linvel().y, z: wanderDir.current.y * cfg.speed }, true)
      if (fleeTimer.current <= 0) state.current = 'idle'
      return
    }

    // Idle wander
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
```

- [ ] **Step 2: Create `components/animals/AnimalSpawner.tsx`**

```tsx
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
```

- [ ] **Step 3: Add `AnimalSpawner` to `ForestWorld.tsx` inside `<Physics>`**

```tsx
import { AnimalSpawner } from '@/components/animals/AnimalSpawner'
// pass hunterMeshRef:
<AnimalSpawner hunterRef={hunterMeshRef} />
```

- [ ] **Step 4: Run dev — walk toward animals, they flee**

Expected: colored capsule animals visible, flee when hunter approaches within ~8 units.

- [ ] **Step 5: Commit**

```bash
git add components/animals/Animal.tsx components/animals/AnimalSpawner.tsx components/world/ForestWorld.tsx
git commit -m "feat: animal system with idle wander and proximity flee AI"
```

---

## Phase 5 — Zone System

### Task 11: Zone sensors + HUD prompt

**Files:**
- Create: `components/zones/ZoneManager.tsx`
- Create: `components/zones/ZoneSensor.tsx`
- Create: `components/ui/HUD.tsx`
- Modify: `components/world/ForestWorld.tsx`

- [ ] **Step 1: Create `components/zones/ZoneSensor.tsx`**

```tsx
import { useRef } from 'react'
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
```

- [ ] **Step 2: Create `components/zones/ZoneManager.tsx`**

```tsx
import { ZoneSensor } from './ZoneSensor'

// Positions match the world map layout
export function ZoneManager() {
  return (
    <>
      <ZoneSensor id="cabin"     position={[ 0,  1,  0]}  size={[5, 3, 5]}  />
      <ZoneSensor id="waterfall" position={[ 0,  1, -45]} size={[6, 3, 6]}  />
      <ZoneSensor id="ruins"     position={[40,  1, -15]} size={[7, 3, 7]}  />
      <ZoneSensor id="grove"     position={[-35, 1, -20]} size={[6, 3, 6]}  />
      <ZoneSensor id="firefly"   position={[35,  1, 30]}  size={[6, 3, 6]}  />
      <ZoneSensor id="campfire"  position={[ 0,  1, 35]}  size={[5, 3, 5]}  />
    </>
  )
}
```

- [ ] **Step 3: Create `components/ui/HUD.tsx`**

```tsx
'use client'
import { useEffect } from 'react'
import { useGameStore } from '@/lib/store'

const ZONE_NAMES: Record<string, string> = {
  cabin:     "Hunter's Cabin",
  waterfall: 'Waterfall Shrine',
  ruins:     'Ancient Ruins',
  grove:     'Mushroom Grove',
  firefly:   'Firefly Clearing',
  campfire:  'Campfire',
}

export function HUD() {
  const activeZone = useGameStore((s) => s.activeZone)
  const enteredZone = useGameStore((s) => s.enteredZone)
  const enterZone = useGameStore((s) => s.enterZone)
  const exitZone = useGameStore((s) => s.exitZone)
  const muted = useGameStore((s) => s.muted)
  const toggleMute = useGameStore((s) => s.toggleMute)

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.code === 'KeyE' && activeZone && !enteredZone) enterZone(activeZone)
      if (e.code === 'Escape' && enteredZone) exitZone()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [activeZone, enteredZone, enterZone, exitZone])

  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 10 }}>
      {/* Zone prompt */}
      {activeZone && !enteredZone && (
        <div style={{
          position: 'absolute', bottom: '12%', left: '50%', transform: 'translateX(-50%)',
          background: 'rgba(8,8,12,0.85)', border: '1px solid rgba(255,255,255,0.12)',
          borderRadius: 10, padding: '10px 22px', textAlign: 'center',
          fontFamily: 'var(--font-display), sans-serif',
        }}>
          <div style={{ color: '#a0a0aa', fontSize: 12, marginBottom: 3 }}>
            {ZONE_NAMES[activeZone]}
          </div>
          <div style={{ color: '#f5f5f7', fontSize: 14 }}>
            <span style={{
              background: 'rgba(255,122,61,0.15)', border: '1px solid rgba(255,122,61,0.4)',
              borderRadius: 5, padding: '1px 7px', marginRight: 8, color: '#ff7a3d',
              fontWeight: 700,
            }}>E</span>
            Enter
          </div>
        </div>
      )}

      {/* Mute button */}
      <button
        onClick={toggleMute}
        style={{
          position: 'absolute', top: 20, right: 20,
          background: 'rgba(8,8,12,0.7)', border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: 8, color: '#a0a0aa', padding: '6px 12px', cursor: 'pointer',
          fontFamily: 'var(--font-display), sans-serif', fontSize: 13, pointerEvents: 'all',
        }}
      >
        {muted ? '🔇' : '🔊'}
      </button>
    </div>
  )
}
```

- [ ] **Step 4: Add `ZoneManager` to `ForestWorld.tsx` + `HUD` to `page.tsx`**

In `ForestWorld.tsx` inside `<Physics>`:
```tsx
import { ZoneManager } from '@/components/zones/ZoneManager'
<ZoneManager />
```

In `app/page.tsx`:
```tsx
import { HUD } from '@/components/ui/HUD'

export default function Home() {
  return (
    <>
      <ForestWorld />
      <HUD />
    </>
  )
}
```

- [ ] **Step 5: Run dev — walk to cabin area, verify [E] prompt appears**

Expected: walking to zone origin triggers HUD prompt showing zone name and E key.

- [ ] **Step 6: Commit**

```bash
git add components/zones/ZoneSensor.tsx components/zones/ZoneManager.tsx components/ui/HUD.tsx app/page.tsx components/world/ForestWorld.tsx
git commit -m "feat: zone sensors, HUD prompt, E-to-enter / ESC-to-exit keyboard handling"
```

---

### Task 12: Zone panel overlay + camera dolly

**Files:**
- Create: `components/ui/ZonePanel.tsx`
- Modify: `components/world/ForestWorld.tsx`

- [ ] **Step 1: Create `components/ui/ZonePanel.tsx`**

```tsx
'use client'
import { useEffect, useRef } from 'react'
import { useGameStore } from '@/lib/store'
import { gsap } from 'gsap'

// Panel content components imported lazily
import dynamic from 'next/dynamic'
const CabinPanel     = dynamic(() => import('@/components/panels/CabinPanel'))
const WaterfallPanel = dynamic(() => import('@/components/panels/WaterfallPanel'))
const RuinsPanel     = dynamic(() => import('@/components/panels/RuinsPanel'))
const GrovePanel     = dynamic(() => import('@/components/panels/GrovePanel'))
const FireflyPanel   = dynamic(() => import('@/components/panels/FireflyPanel'))
const CampfirePanel  = dynamic(() => import('@/components/panels/CampfirePanel'))

const PANEL_MAP: Record<string, React.ComponentType> = {
  cabin:     CabinPanel,
  waterfall: WaterfallPanel,
  ruins:     RuinsPanel,
  grove:     GrovePanel,
  firefly:   FireflyPanel,
  campfire:  CampfirePanel,
}

export function ZonePanel() {
  const enteredZone = useGameStore((s) => s.enteredZone)
  const overlayRef  = useRef<HTMLDivElement>(null)
  const contentRef  = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const overlay = overlayRef.current
    const content = contentRef.current
    if (!overlay || !content) return

    if (enteredZone) {
      gsap.set(overlay, { display: 'flex' })
      gsap.fromTo(overlay,  { opacity: 0 }, { opacity: 1, duration: 0.4, ease: 'power2.out' })
      gsap.fromTo(content,  { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, delay: 0.1, ease: 'power3.out' })
    } else {
      gsap.to(content, { y: 20, opacity: 0, duration: 0.3, ease: 'power2.in' })
      gsap.to(overlay, {
        opacity: 0, duration: 0.35, delay: 0.1,
        onComplete: () => gsap.set(overlay, { display: 'none' }),
      })
    }
  }, [enteredZone])

  const Panel = enteredZone ? PANEL_MAP[enteredZone] : null

  return (
    <div
      ref={overlayRef}
      style={{
        display: 'none', position: 'fixed', inset: 0,
        background: 'rgba(8,8,12,0.92)',
        backdropFilter: 'blur(8px) brightness(0.6)',
        zIndex: 20, alignItems: 'center', justifyContent: 'center',
        overflowY: 'auto',
      }}
    >
      <div
        ref={contentRef}
        style={{
          width: '100%', maxWidth: 860, padding: '48px 40px',
          fontFamily: 'var(--font-body), sans-serif',
        }}
      >
        {Panel && <Panel />}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Add `ZonePanel` to `app/page.tsx`**

```tsx
import { ZonePanel } from '@/components/ui/ZonePanel'

export default function Home() {
  return (
    <>
      <ForestWorld />
      <HUD />
      <ZonePanel />
    </>
  )
}
```

- [ ] **Step 3: Create stub panel files so dynamic imports resolve**

Create these 6 files, each identical in structure (content filled in Task 13–18):

`components/panels/CabinPanel.tsx`:
```tsx
export default function CabinPanel() {
  return <div style={{ color: '#f5f5f7' }}><h1>About — coming soon</h1></div>
}
```

Repeat for `WaterfallPanel.tsx`, `RuinsPanel.tsx`, `GrovePanel.tsx`, `FireflyPanel.tsx`, `CampfirePanel.tsx` with matching `<h1>` text.

- [ ] **Step 4: Run dev — walk to zone, press E, verify panel slides in; ESC closes it**

Expected: dark overlay fades in, stub content visible, ESC fades it out.

- [ ] **Step 5: Commit**

```bash
git add components/ui/ZonePanel.tsx components/panels/*.tsx app/page.tsx
git commit -m "feat: zone panel overlay with GSAP fade-in/out animation"
```

---

## Phase 6 — Content Panels

### Task 13: Cabin panel (About)

**Files:**
- Modify: `components/panels/CabinPanel.tsx`

- [ ] **Step 1: Replace stub with full About content**

```tsx
export default function CabinPanel() {
  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 40 }}>
        <h1 style={{
          fontFamily: 'var(--font-display), sans-serif',
          fontSize: 'clamp(32px, 5vw, 52px)', fontWeight: 700,
          background: 'linear-gradient(120deg, #ff7a3d 0%, #e11d74 50%, #5b3df5 100%)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          marginBottom: 8,
        }}>Vikas Singh Rawat</h1>
        <p style={{ color: '#a0a0aa', fontSize: 18 }}>Full-Stack Engineer · Bangalore, India · IST</p>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 6, marginTop: 12,
          background: 'rgba(74,222,128,0.1)', border: '1px solid rgba(74,222,128,0.3)',
          borderRadius: 20, padding: '4px 14px',
        }}>
          <span style={{ width: 8, height: 8, background: '#4ade80', borderRadius: '50%', display: 'inline-block' }} />
          <span style={{ color: '#4ade80', fontSize: 13 }}>Open to senior / mid full-stack roles · 2026</span>
        </div>
      </div>

      {/* Bio */}
      <p style={{ color: '#d0d0d8', fontSize: 16, lineHeight: 1.7, marginBottom: 32, maxWidth: 640 }}>
        Full-stack engineer at Outbox Labs. Promoted from a 7-month internship to full-time after shipping
        ColdStats from an empty repo to paying customers. Strong on Next.js + Node.js + MongoDB; comfortable
        across the entire delivery surface — schema, API, UI, deploy.
      </p>

      {/* Current Role */}
      <div style={{
        background: '#0f0f14', border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 12, padding: '20px 24px', marginBottom: 32,
      }}>
        <div style={{ color: '#60606a', fontSize: 11, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>
          Current Role
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ color: '#f5f5f7', fontWeight: 600, fontSize: 17 }}>Full-Stack Engineer</div>
            <div style={{ color: '#a0a0aa', fontSize: 14 }}>Outbox Labs · Remote · Feb 2026 – Present</div>
          </div>
          <span style={{
            background: 'rgba(255,122,61,0.15)', border: '1px solid rgba(255,122,61,0.3)',
            color: '#ff7a3d', fontSize: 11, padding: '3px 10px', borderRadius: 20, whiteSpace: 'nowrap',
          }}>Promoted from intern</span>
        </div>
      </div>

      {/* Experience Timeline */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ color: '#60606a', fontSize: 11, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 16 }}>
          Experience
        </div>
        {[
          { role: 'Full-Stack Engineering Intern', org: 'Outbox Labs', period: 'Jul 2025 – Jan 2026', detail: '6 production projects, owned ColdStats end-to-end.' },
          { role: 'Full-Stack Web Development', org: 'Coding Ninjas', period: 'Apr 2024 – Apr 2025', detail: 'Frontend + backend tracks. Project-driven curriculum.' },
          { role: 'M.Sc Graduate', org: 'Jaipur National University', period: '2021 – 2023', detail: 'Pivoted into software through self-learning after graduation.' },
        ].map((item, i) => (
          <div key={i} style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0 }}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#ff7a3d', flexShrink: 0, marginTop: 4 }} />
              {i < 2 && <div style={{ width: 1, flex: 1, background: 'rgba(255,255,255,0.08)', marginTop: 4 }} />}
            </div>
            <div style={{ paddingBottom: 12 }}>
              <div style={{ color: '#f5f5f7', fontWeight: 500 }}>{item.role}</div>
              <div style={{ color: '#a0a0aa', fontSize: 13 }}>{item.org} · {item.period}</div>
              <div style={{ color: '#60606a', fontSize: 13, marginTop: 3 }}>{item.detail}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Links */}
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        {[
          { label: 'GitHub',   href: 'https://github.com/vikasRawat17',                          color: '#f5f5f7' },
          { label: 'LinkedIn', href: 'https://www.linkedin.com/in/vikassinghrawat17',             color: '#0ea5e9' },
          { label: 'Resume',   href: '/resume.pdf',                                              color: '#ff7a3d' },
        ].map((l) => (
          <a key={l.label} href={l.href} target="_blank" rel="noopener noreferrer" style={{
            color: l.color, border: `1px solid ${l.color}33`, borderRadius: 8,
            padding: '8px 18px', fontSize: 14, textDecoration: 'none',
            background: `${l.color}0d`,
          }}>
            {l.label} ↗
          </a>
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Run dev — enter cabin zone, verify About panel renders correctly**

Expected: gradient name heading, bio, role card, timeline, links all visible.

- [ ] **Step 3: Commit**

```bash
git add components/panels/CabinPanel.tsx
git commit -m "feat: Cabin panel — About section with bio, timeline, links"
```

---

### Task 14: Waterfall panel (ColdStats) + Ruins panel (Production)

**Files:**
- Modify: `components/panels/WaterfallPanel.tsx`
- Modify: `components/panels/RuinsPanel.tsx`

- [ ] **Step 1: Replace `WaterfallPanel.tsx` with ColdStats spotlight**

```tsx
export default function WaterfallPanel() {
  return (
    <div>
      <div style={{ marginBottom: 8 }}>
        <span style={{ color: '#8b7bff', fontSize: 12, textTransform: 'uppercase', letterSpacing: 1 }}>
          Spotlight · Founding Engineer
        </span>
      </div>
      <h1 style={{
        fontFamily: 'var(--font-display), sans-serif',
        fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 700, color: '#f5f5f7', marginBottom: 8,
      }}>ColdStats</h1>
      <p style={{ color: '#a0a0aa', fontSize: 17, marginBottom: 24 }}>
        AI cold-outreach analytics. Connect every sending platform, surface what's working, automate the rest.
      </p>

      <p style={{ color: '#d0d0d8', lineHeight: 1.7, fontSize: 15, marginBottom: 32, maxWidth: 620 }}>
        Built end-to-end from an empty repo — backend, frontend, infra, integrations. Promoted from intern to
        full-time engineer after shipping this to paying customers. Multi-platform connectors, AI-driven
        monitoring, and deliverability automation all mine to ship.
      </p>

      {/* Highlights */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 12, marginBottom: 32 }}>
        {[
          { title: 'Multi-platform connectors', body: 'EmailBison, ReachInbox, Instantly, SmartLead — one dashboard for all campaigns.' },
          { title: 'AI monitoring', body: 'Real-time alerts on deliverability shifts before they tank reply rates.' },
          { title: 'Scheduled-email engine', body: 'Campaign performance, response distribution, automated follow-up sequencing.' },
          { title: 'Founding ownership', body: 'Schema → API → UI → infra → deploy. Every line of this product is mine.' },
        ].map((h) => (
          <div key={h.title} style={{
            background: '#0f0f14', border: '1px solid rgba(91,61,245,0.2)',
            borderRadius: 10, padding: '16px 18px',
          }}>
            <div style={{ color: '#8b7bff', fontWeight: 600, fontSize: 14, marginBottom: 6 }}>{h.title}</div>
            <div style={{ color: '#a0a0aa', fontSize: 13, lineHeight: 1.5 }}>{h.body}</div>
          </div>
        ))}
      </div>

      {/* Tags + Link */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
        {['Next.js', 'Node.js', 'TypeScript', 'MongoDB', 'AI'].map((t) => (
          <span key={t} style={{
            background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
            color: '#a0a0aa', fontSize: 12, padding: '3px 10px', borderRadius: 6,
          }}>{t}</span>
        ))}
      </div>
      <a href="https://app.coldstats.ai" target="_blank" rel="noopener noreferrer" style={{
        display: 'inline-block',
        background: 'linear-gradient(120deg, #5b3df5, #e11d74)',
        color: '#fff', padding: '10px 24px', borderRadius: 8, textDecoration: 'none', fontSize: 14, fontWeight: 600,
      }}>
        View ColdStats ↗
      </a>
    </div>
  )
}
```

- [ ] **Step 2: Replace `RuinsPanel.tsx` with Outbox Labs production work**

```tsx
const PROJECTS = [
  {
    title: 'ReachInbox',
    role: 'Frontend Engineer',
    tagline: 'AI cold-email platform. 500M+ emails sent, $2.5B+ pipeline generated.',
    tags: ['React', 'Next.js', 'TypeScript', 'Tailwind'],
    highlights: [
      'Shipped Enrich-with-AI flow for prospect data enrichment.',
      'Built Pre-warmup + Inbox-Placement flows for deliverability ops.',
      'Authored Tutorial Toolkit + Video Flow for in-app onboarding.',
      'High-traffic features touching tens of thousands of users.',
    ],
    metrics: [
      { label: 'Emails sent', value: '500M+' },
      { label: 'Pipeline',    value: '$2.5B+' },
      { label: 'G2 rating',   value: '4.6/5'  },
    ],
    link: 'https://reachinbox.ai',
    accent: '#e11d74',
  },
  {
    title: 'MailVerify',
    role: 'Bug fixes · Maintenance',
    tagline: 'Email verification tooling. Validation, bounce protection, list hygiene.',
    tags: ['React', 'Node.js', 'TypeScript'],
    highlights: [
      'Triaged production issues across the verification pipeline.',
      'Patched UI regressions and edge cases in the validation flow.',
    ],
    metrics: [],
    link: null,
    accent: '#ff7a3d',
  },
  {
    title: 'Zapamail',
    role: 'Bug fixes · Maintenance',
    tagline: 'Mailbox provisioning and automation inside the Outbox Labs ecosystem.',
    tags: ['React', 'Node.js', 'TypeScript'],
    highlights: [
      'Stabilised customer-reported bugs across mailbox flows.',
      'Supported feature work alongside core product engineers.',
    ],
    metrics: [],
    link: null,
    accent: '#ff7a3d',
  },
]

export default function RuinsPanel() {
  return (
    <div>
      <div style={{ marginBottom: 8, color: '#e11d74', fontSize: 12, textTransform: 'uppercase', letterSpacing: 1 }}>
        Production Work · Outbox Labs
      </div>
      <h1 style={{
        fontFamily: 'var(--font-display), sans-serif',
        fontSize: 'clamp(26px, 4vw, 38px)', fontWeight: 700, color: '#f5f5f7', marginBottom: 32,
      }}>
        Shipped to Thousands
      </h1>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        {PROJECTS.map((p) => (
          <div key={p.title} style={{
            background: '#0f0f14', border: `1px solid ${p.accent}22`,
            borderRadius: 12, padding: '22px 24px',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
              <div>
                <h2 style={{ color: '#f5f5f7', fontWeight: 700, fontSize: 20, marginBottom: 2 }}>{p.title}</h2>
                <div style={{ color: '#a0a0aa', fontSize: 13 }}>{p.role}</div>
              </div>
              {p.link && (
                <a href={p.link} target="_blank" rel="noopener noreferrer" style={{
                  color: p.accent, fontSize: 13, textDecoration: 'none',
                  border: `1px solid ${p.accent}44`, borderRadius: 6, padding: '4px 12px',
                }}>Visit ↗</a>
              )}
            </div>
            <p style={{ color: '#a0a0aa', fontSize: 14, marginBottom: 12 }}>{p.tagline}</p>
            {p.metrics.length > 0 && (
              <div style={{ display: 'flex', gap: 16, marginBottom: 12 }}>
                {p.metrics.map((m) => (
                  <div key={m.label}>
                    <div style={{ color: p.accent, fontWeight: 700, fontSize: 16 }}>{m.value}</div>
                    <div style={{ color: '#60606a', fontSize: 11 }}>{m.label}</div>
                  </div>
                ))}
              </div>
            )}
            <ul style={{ paddingLeft: 16, margin: 0 }}>
              {p.highlights.map((h) => (
                <li key={h} style={{ color: '#d0d0d8', fontSize: 13, lineHeight: 1.6, marginBottom: 4 }}>{h}</li>
              ))}
            </ul>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 12 }}>
              {p.tags.map((t) => (
                <span key={t} style={{
                  background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)',
                  color: '#a0a0aa', fontSize: 11, padding: '2px 8px', borderRadius: 4,
                }}>{t}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Run dev — enter waterfall + ruins zones, verify panels**

- [ ] **Step 4: Commit**

```bash
git add components/panels/WaterfallPanel.tsx components/panels/RuinsPanel.tsx
git commit -m "feat: Waterfall panel (ColdStats) and Ruins panel (production projects)"
```

---

### Task 15: Grove panel (Experimental) + Firefly panel (Skills) + Campfire panel (Contact)

**Files:**
- Modify: `components/panels/GrovePanel.tsx`
- Modify: `components/panels/FireflyPanel.tsx`
- Modify: `components/panels/CampfirePanel.tsx`

- [ ] **Step 1: Replace `GrovePanel.tsx` with experimental projects**

```tsx
const PROJECTS = [
  {
    title: 'SkillSwap',
    tagline: 'MERN platform for trading skills. Real-time chat, matchmaking, JWT-secured APIs.',
    year: 'Mar 2025',
    tags: ['MERN', 'Socket.io', 'JWT', 'Render'],
    highlights: [
      'Real-time chat via Socket.io — sub-100ms latency for 95% of users.',
      'JWT + HTTP-only cookies + rate-limiting; cut unauthorised access by 90%.',
      'Framer Motion micro-interactions; +25% session time.',
    ],
    github: 'https://github.com/vikasRawat17/skillswap',
    accent: '#4ade80',
  },
  {
    title: 'Crypto Tracker',
    tagline: 'Live market dashboard — coins, watchlists, price alerts. WebSocket price feeds.',
    year: '2026 · In progress',
    tags: ['Next.js', 'TypeScript', 'WebSockets'],
    highlights: [
      'Streaming price feeds with reconnect-safe WebSocket layer.',
      'Watchlist persistence + chart sparklines per coin.',
    ],
    github: 'https://github.com/vikasRawat17/crypto-app',
    accent: '#4ade80',
  },
  {
    title: 'Routine Management',
    tagline: 'Task organiser with role-based access and optimised MongoDB reads.',
    year: 'Jan 2025 · Archived',
    tags: ['MongoDB', 'Express', 'JWT', 'Redux'],
    highlights: [
      'MongoDB indexes + lean queries cut API latency by 40%.',
      'JWT + RBAC blocked 95% of unauthorised access attempts.',
    ],
    github: 'https://github.com/vikasRawat17',
    accent: '#4ade80',
  },
]

export default function GrovePanel() {
  return (
    <div>
      <div style={{ color: '#4ade80', fontSize: 12, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>
        Experimental Projects
      </div>
      <h1 style={{
        fontFamily: 'var(--font-display), sans-serif',
        fontSize: 'clamp(26px, 4vw, 38px)', fontWeight: 700, color: '#f5f5f7', marginBottom: 32,
      }}>
        Side Projects
      </h1>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {PROJECTS.map((p) => (
          <div key={p.title} style={{
            background: '#0f0f14', border: '1px solid rgba(74,222,128,0.15)',
            borderRadius: 12, padding: '20px 22px',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
              <div>
                <h2 style={{ color: '#f5f5f7', fontWeight: 700, fontSize: 18, marginBottom: 2 }}>{p.title}</h2>
                <div style={{ color: '#60606a', fontSize: 12 }}>{p.year}</div>
              </div>
              <a href={p.github} target="_blank" rel="noopener noreferrer" style={{
                color: '#4ade80', fontSize: 12, textDecoration: 'none',
                border: '1px solid rgba(74,222,128,0.3)', borderRadius: 6, padding: '3px 10px',
              }}>GitHub ↗</a>
            </div>
            <p style={{ color: '#a0a0aa', fontSize: 14, marginBottom: 10 }}>{p.tagline}</p>
            <ul style={{ paddingLeft: 16, margin: '0 0 10px' }}>
              {p.highlights.map((h) => (
                <li key={h} style={{ color: '#d0d0d8', fontSize: 13, lineHeight: 1.6, marginBottom: 3 }}>{h}</li>
              ))}
            </ul>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {p.tags.map((t) => (
                <span key={t} style={{
                  background: 'rgba(74,222,128,0.06)', border: '1px solid rgba(74,222,128,0.15)',
                  color: '#4ade80', fontSize: 11, padding: '2px 8px', borderRadius: 4,
                }}>{t}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Replace `FireflyPanel.tsx` with interactive skill constellation**

```tsx
'use client'
import { useState } from 'react'

type Skill = { name: string; years: string; note?: string; level: 'daily' | 'comfortable' | 'learning' }

const SKILLS: Skill[] = [
  { name: 'TypeScript',     years: '3y', note: 'Default for everything I ship.',          level: 'daily'       },
  { name: 'Next.js',        years: '2y', note: 'App Router, Server actions, Route handlers.', level: 'daily'  },
  { name: 'React',          years: '3y', note: 'Hooks, suspense, server components.',     level: 'daily'       },
  { name: 'Node.js',        years: '3y', note: 'API design, queues, integrations.',       level: 'daily'       },
  { name: 'MongoDB',        years: '2y', note: 'Indexes earn their keep.',                level: 'daily'       },
  { name: 'Tailwind',       years: '2y', note: 'Tokens over utilities.',                  level: 'daily'       },
  { name: 'Express',        years: '2y', note: 'REST APIs, middleware pipelines.',        level: 'comfortable' },
  { name: 'Socket.io',      years: '1y', note: 'Real-time chat in SkillSwap.',           level: 'comfortable' },
  { name: 'Firebase',       years: '1y', note: 'Auth + Firestore for quick prototypes.',  level: 'comfortable' },
  { name: 'Redux',          years: '2y', note: 'Redux-Persist for session state.',        level: 'comfortable' },
  { name: 'Framer Motion',  years: '1y', note: 'Micro-interactions that earn compute.',   level: 'comfortable' },
  { name: 'MySQL',          years: '1y',                                                  level: 'comfortable' },
  { name: 'GSAP',           years: 'now', note: 'Scroll choreography.',                   level: 'learning'    },
  { name: 'Three.js / R3F', years: 'now', note: 'Web 3D / shaders.',                     level: 'learning'    },
  { name: 'System Design',  years: 'ongoing', note: 'Microservices, queues, scaling.',   level: 'learning'    },
  { name: 'DSA / C++',      years: 'ongoing', note: 'LeetCode grind.',                   level: 'learning'    },
]

const LEVEL_STYLE: Record<Skill['level'], { dot: string; bg: string; border: string }> = {
  daily:       { dot: '#ff7a3d', bg: 'rgba(255,122,61,0.08)',   border: 'rgba(255,122,61,0.25)'   },
  comfortable: { dot: '#e11d74', bg: 'rgba(225,29,116,0.08)',   border: 'rgba(225,29,116,0.2)'    },
  learning:    { dot: '#5b3df5', bg: 'rgba(91,61,245,0.08)',    border: 'rgba(91,61,245,0.2)'     },
}

const LEVEL_LABEL: Record<Skill['level'], string> = {
  daily:       'Daily driver',
  comfortable: 'Comfortable',
  learning:    'Learning now',
}

export default function FireflyPanel() {
  const [active, setActive] = useState<Skill | null>(null)

  return (
    <div>
      <div style={{ color: '#ffd700', fontSize: 12, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>
        Skills · Stack
      </div>
      <h1 style={{
        fontFamily: 'var(--font-display), sans-serif',
        fontSize: 'clamp(26px, 4vw, 38px)', fontWeight: 700, color: '#f5f5f7', marginBottom: 12,
      }}>Tech I Work With</h1>

      {/* Legend */}
      <div style={{ display: 'flex', gap: 20, marginBottom: 32 }}>
        {(['daily', 'comfortable', 'learning'] as const).map((l) => (
          <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: LEVEL_STYLE[l].dot }} />
            <span style={{ color: '#a0a0aa', fontSize: 13 }}>{LEVEL_LABEL[l]}</span>
          </div>
        ))}
      </div>

      {/* Skill dots */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 32 }}>
        {SKILLS.map((s) => {
          const st = LEVEL_STYLE[s.level]
          const isActive = active?.name === s.name
          return (
            <button
              key={s.name}
              onClick={() => setActive(isActive ? null : s)}
              style={{
                background: isActive ? st.bg : 'rgba(255,255,255,0.03)',
                border: `1px solid ${isActive ? st.dot : 'rgba(255,255,255,0.08)'}`,
                borderRadius: 8, padding: '8px 16px', cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: 7, transition: 'all 0.15s',
              }}
            >
              <span style={{
                width: 7, height: 7, borderRadius: '50%', background: st.dot,
                boxShadow: `0 0 6px ${st.dot}`,
              }} />
              <span style={{ color: '#f5f5f7', fontSize: 14 }}>{s.name}</span>
              <span style={{ color: '#60606a', fontSize: 11 }}>{s.years}</span>
            </button>
          )
        })}
      </div>

      {/* Active skill detail */}
      {active && (
        <div style={{
          background: LEVEL_STYLE[active.level].bg,
          border: `1px solid ${LEVEL_STYLE[active.level].border}`,
          borderRadius: 10, padding: '16px 20px',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ color: '#f5f5f7', fontWeight: 600, fontSize: 17 }}>{active.name}</div>
            <span style={{
              color: LEVEL_STYLE[active.level].dot, fontSize: 12,
              background: `${LEVEL_STYLE[active.level].dot}15`,
              border: `1px solid ${LEVEL_STYLE[active.level].border}`,
              borderRadius: 20, padding: '2px 10px',
            }}>
              {LEVEL_LABEL[active.level]} · {active.years}
            </span>
          </div>
          {active.note && (
            <div style={{ color: '#a0a0aa', fontSize: 14, marginTop: 6 }}>{active.note}</div>
          )}
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 3: Replace `CampfirePanel.tsx` with Contact section**

```tsx
export default function CampfirePanel() {
  return (
    <div>
      <div style={{ color: '#ffb088', fontSize: 12, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>
        Contact
      </div>
      <h1 style={{
        fontFamily: 'var(--font-display), sans-serif',
        fontSize: 'clamp(26px, 4vw, 38px)', fontWeight: 700, color: '#f5f5f7', marginBottom: 12,
      }}>Let's Talk</h1>
      <p style={{ color: '#a0a0aa', fontSize: 16, marginBottom: 32, maxWidth: 480 }}>
        Open to senior / mid full-stack roles and selected freelance work. Response within 48 hours.
      </p>

      {/* Links */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 40, maxWidth: 400 }}>
        {[
          { label: 'Email',    value: 'rawatvikas17jan@gmail.com', href: 'mailto:rawatvikas17jan@gmail.com', color: '#ff7a3d' },
          { label: 'GitHub',   value: 'github.com/vikasRawat17',   href: 'https://github.com/vikasRawat17',  color: '#f5f5f7' },
          { label: 'LinkedIn', value: 'in/vikassinghrawat17',       href: 'https://www.linkedin.com/in/vikassinghrawat17', color: '#0ea5e9' },
        ].map((l) => (
          <a key={l.label} href={l.href} target="_blank" rel="noopener noreferrer" style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            background: '#0f0f14', border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 10, padding: '14px 18px', textDecoration: 'none',
          }}>
            <div>
              <div style={{ color: '#60606a', fontSize: 11, marginBottom: 2 }}>{l.label}</div>
              <div style={{ color: l.color, fontSize: 14 }}>{l.value}</div>
            </div>
            <span style={{ color: '#a0a0aa' }}>↗</span>
          </a>
        ))}
      </div>

      {/* Resume download */}
      <a
        href="/resume.pdf"
        download="vikas_resume.pdf"
        style={{
          display: 'inline-block',
          background: 'linear-gradient(120deg, #ff7a3d, #e11d74)',
          color: '#fff', padding: '12px 28px', borderRadius: 8,
          textDecoration: 'none', fontSize: 15, fontWeight: 600,
        }}
      >
        Download Resume ↓
      </a>

      {/* Footer credits */}
      <div style={{ marginTop: 48, paddingTop: 24, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
          {[
            ['Set in',        'Space Grotesk · JetBrains Mono'],
            ['Built with',    'Next.js · R3F · GSAP'],
            ['Hosted on',     'Vercel'],
          ].map(([k, v]) => (
            <div key={k}>
              <div style={{ color: '#40404a', fontSize: 11 }}>{k}</div>
              <div style={{ color: '#60606a', fontSize: 12 }}>{v}</div>
            </div>
          ))}
        </div>
        <div style={{ color: '#40404a', fontSize: 12, marginTop: 12 }}>
          © 2026 Vikas Singh Rawat · Bangalore, India · IST
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Run dev — enter all three zones, verify panels**

- [ ] **Step 5: Commit**

```bash
git add components/panels/GrovePanel.tsx components/panels/FireflyPanel.tsx components/panels/CampfirePanel.tsx
git commit -m "feat: Grove (experimental), Firefly (skills), Campfire (contact) panels"
```

---

## Phase 7 — Audio + Loading

### Task 16: Audio system

**Files:**
- Create: `lib/audio.ts`
- Modify: `app/page.tsx`

- [ ] **Step 1: Create `lib/audio.ts`**

```ts
import { Howl, Howler } from 'howler'
import type { WeatherState } from './store'

let baseLoop:  Howl | null = null
let rainLoop:  Howl | null = null
let windLoop:  Howl | null = null

export function initAudio(): void {
  baseLoop = new Howl({ src: ['/sounds/forest-night.mp3'], loop: true, volume: 0.4 })
  rainLoop = new Howl({ src: ['/sounds/rain-loop.mp3'],    loop: true, volume: 0   })
  windLoop = new Howl({ src: ['/sounds/wind-eerie.mp3'],   loop: true, volume: 0   })

  baseLoop.play()
  rainLoop.play()
  windLoop.play()
}

export function setWeatherAudio(weather: WeatherState): void {
  const duration = 2000 // ms
  switch (weather) {
    case 'clear':
      rainLoop?.fade(rainLoop.volume(), 0,    duration)
      windLoop?.fade(windLoop.volume(), 0,    duration)
      break
    case 'fog':
      rainLoop?.fade(rainLoop.volume(), 0,    duration)
      windLoop?.fade(windLoop.volume(), 0.35, duration)
      break
    case 'rain':
      rainLoop?.fade(rainLoop.volume(), 0.5,  duration)
      windLoop?.fade(windLoop.volume(), 0,    duration)
      break
    case 'storm':
      rainLoop?.fade(rainLoop.volume(), 0.75, duration)
      windLoop?.fade(windLoop.volume(), 0.2,  duration)
      scheduleThunder()
      break
  }
}

let thunderTimer: ReturnType<typeof setTimeout> | null = null

function scheduleThunder(): void {
  const delay = 8000 + Math.random() * 17000
  thunderTimer = setTimeout(() => {
    const n = Math.ceil(Math.random() * 3)
    const thunder = new Howl({ src: [`/sounds/thunder-${n}.mp3`], volume: 0.6 })
    thunder.play()
    scheduleThunder()
  }, delay)
}

export function stopThunder(): void {
  if (thunderTimer) clearTimeout(thunderTimer)
  thunderTimer = null
}

export function setMuted(muted: boolean): void {
  Howler.mute(muted)
}
```

- [ ] **Step 2: Wire audio to weather state in `app/page.tsx`**

```tsx
'use client'
import dynamic from 'next/dynamic'
import { useEffect } from 'react'
import { useGameStore } from '@/lib/store'
import { initAudio, setWeatherAudio, setMuted } from '@/lib/audio'
import { HUD } from '@/components/ui/HUD'
import { ZonePanel } from '@/components/ui/ZonePanel'

const ForestWorld = dynamic(() => import('@/components/world/ForestWorld'), {
  ssr: false,
  loading: () => <div style={{ width: '100vw', height: '100vh', background: '#08080c' }} />,
})

export default function Home() {
  const weather = useGameStore((s) => s.weather)
  const muted   = useGameStore((s) => s.muted)
  const loaded  = useGameStore((s) => s.loaded)

  useEffect(() => {
    if (loaded) initAudio()
  }, [loaded])

  useEffect(() => {
    setWeatherAudio(weather)
  }, [weather])

  useEffect(() => {
    setMuted(muted)
  }, [muted])

  return (
    <>
      <ForestWorld />
      <HUD />
      <ZonePanel />
    </>
  )
}
```

- [ ] **Step 3: Add placeholder sound files note**

```bash
# Sound files must be placed in public/sounds/ before audio works:
# forest-night.mp3, rain-loop.mp3, wind-eerie.mp3
# thunder-1.mp3, thunder-2.mp3, thunder-3.mp3
# waterfall.mp3, fire-crackle.mp3
#
# Royalty-free sources: freesound.org, pixabay.com/sound-effects
# Search: "forest night ambience", "rain loop", "thunder crack", "wind forest"
echo "Add sound files to public/sounds/ — see freesound.org"
```

- [ ] **Step 4: Verify mute toggle works (no audio errors in console)**

```bash
npm run dev
```

Expected: no Howler errors in console; mute button silences all audio.

- [ ] **Step 5: Commit**

```bash
git add lib/audio.ts app/page.tsx
git commit -m "feat: Howler.js audio system with weather-reactive layers and mute toggle"
```

---

### Task 17: Loading screen

**Files:**
- Modify: `components/ui/LoadingScreen.tsx`
- Modify: `components/world/ForestWorld.tsx`
- Modify: `app/page.tsx`

- [ ] **Step 1: Replace stub `LoadingScreen.tsx` with full implementation**

```tsx
'use client'
import { useEffect, useRef, useState } from 'react'
import { useGameStore } from '@/lib/store'
import { gsap } from 'gsap'

export function LoadingScreen() {
  const setLoaded = useGameStore((s) => s.setLoaded)
  const [progress, setProgress] = useState(0)
  const [ready,    setReady]    = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // Simulate load progress (real progress comes from useProgress in R3F)
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) { clearInterval(interval); setReady(true); return 100 }
        return p + Math.random() * 8
      })
    }, 120)
    return () => clearInterval(interval)
  }, [])

  function handleEnter() {
    const el = containerRef.current
    if (!el) return
    gsap.to(el, {
      opacity: 0, duration: 0.8, ease: 'power2.in',
      onComplete: () => setLoaded(),
    })
  }

  return (
    <div
      ref={containerRef}
      style={{
        position: 'fixed', inset: 0, zIndex: 100,
        background: '#08080c',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        fontFamily: 'var(--font-display), sans-serif',
      }}
    >
      {/* Brand */}
      <div style={{
        fontSize: 'clamp(18px, 3vw, 28px)', fontWeight: 700, marginBottom: 48,
        background: 'linear-gradient(120deg, #ff7a3d, #e11d74 50%, #5b3df5)',
        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
      }}>
        [vsr.dev]
      </div>

      {/* Progress bar */}
      <div style={{
        width: 'min(320px, 70vw)', height: 2,
        background: 'rgba(255,255,255,0.08)', borderRadius: 2, marginBottom: 40,
      }}>
        <div style={{
          height: '100%', borderRadius: 2,
          background: 'linear-gradient(90deg, #ff7a3d, #e11d74, #5b3df5)',
          width: `${Math.min(progress, 100)}%`,
          transition: 'width 0.15s ease',
        }} />
      </div>

      {/* Enter button */}
      <button
        onClick={handleEnter}
        disabled={!ready}
        style={{
          background: ready ? 'rgba(255,122,61,0.12)' : 'rgba(255,255,255,0.03)',
          border: `1px solid ${ready ? 'rgba(255,122,61,0.4)' : 'rgba(255,255,255,0.08)'}`,
          color: ready ? '#ff7a3d' : '#40404a',
          borderRadius: 10, padding: '12px 36px', fontSize: 16, fontWeight: 600,
          cursor: ready ? 'pointer' : 'default',
          transition: 'all 0.3s ease', letterSpacing: 1,
        }}
      >
        {ready ? 'Enter Forest' : 'Loading…'}
      </button>

      <div style={{ color: '#40404a', fontSize: 12, marginTop: 20 }}>
        Vikas Singh Rawat · Full-Stack Engineer
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Add `LoadingScreen` to `app/page.tsx`**

```tsx
import { LoadingScreen } from '@/components/ui/LoadingScreen'

// In Home component:
const loaded = useGameStore((s) => s.loaded)

return (
  <>
    {!loaded && <LoadingScreen />}
    <ForestWorld />
    <HUD />
    <ZonePanel />
  </>
)
```

- [ ] **Step 3: Run dev — verify loading screen appears, progress bar fills, Enter button enables, fade-out works**

Expected: loading screen on initial visit, "Enter Forest" enabled at 100%, fade to forest on click.

- [ ] **Step 4: Commit**

```bash
git add components/ui/LoadingScreen.tsx app/page.tsx
git commit -m "feat: loading screen with progress bar and Enter Forest CTA"
```

---

## Phase 8 — Landmark Placement

### Task 18: Place landmark geometry at zone positions

**Files:**
- Create: `components/world/Landmarks.tsx`
- Modify: `components/world/ForestWorld.tsx`

- [ ] **Step 1: Create `components/world/Landmarks.tsx`**

Procedural landmarks (replaced by Blender .glb in Task 19):

```tsx
import { RigidBody } from '@react-three/rapier'

function Cabin() {
  return (
    <RigidBody type="fixed" colliders="cuboid" position={[0, 0, 0]}>
      <group>
        {/* Walls */}
        <mesh position={[0, 1.5, 0]} castShadow receiveShadow>
          <boxGeometry args={[6, 3, 5]} />
          <meshStandardMaterial color="#3d2510" roughness={0.9} />
        </mesh>
        {/* Roof */}
        <mesh position={[0, 3.5, 0]} rotation={[0, 0, 0]} castShadow>
          <coneGeometry args={[4.5, 2, 4]} />
          <meshStandardMaterial color="#2a1a08" roughness={0.95} />
        </mesh>
        {/* Warm window glow */}
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
      {/* Rock face */}
      <RigidBody type="fixed" colliders="cuboid">
        <mesh position={[0, 4, -3]} castShadow>
          <boxGeometry args={[12, 8, 2]} />
          <meshStandardMaterial color="#2a2a2a" roughness={0.95} />
        </mesh>
      </RigidBody>
      {/* Water plane */}
      <mesh position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[6, 8]} />
        <meshStandardMaterial color="#2255aa" transparent opacity={0.6} roughness={0} metalness={0.3} />
      </mesh>
      <pointLight position={[0, 3, 0]} color="#5566ff" intensity={2} distance={20} decay={2} />
    </group>
  )
}

function MushroomGrove() {
  const shrooms = [[-2, 0, 0], [2, 0, -1], [0, 0, 2], [-1, 0, -2], [3, 0, 1]]
  return (
    <group position={[-35, 0, -20]}>
      {shrooms.map(([x, , z], i) => (
        <group key={i} position={[x as number, 0, z as number]}>
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
      {/* Just lighting — clearing has no structures */}
      <pointLight position={[0, 2, 0]} color="#ffee44" intensity={1} distance={18} decay={2} />
    </group>
  )
}

function Campfire() {
  return (
    <group position={[0, 0, 35]}>
      {/* Stone ring */}
      {Array.from({ length: 8 }, (_, i) => {
        const a = (i / 8) * Math.PI * 2
        return (
          <mesh key={i} position={[Math.cos(a) * 1.2, 0.2, Math.sin(a) * 1.2]} castShadow>
            <dodecahedronGeometry args={[0.3, 0]} />
            <meshStandardMaterial color="#444" roughness={0.95} />
          </mesh>
        )
      })}
      {/* Logs */}
      <mesh position={[0, 0.15, 0]} rotation={[0, 0.8, 0]} castShadow>
        <cylinderGeometry args={[0.12, 0.12, 1.8, 6]} />
        <meshStandardMaterial color="#2a1808" roughness={0.9} />
      </mesh>
      <mesh position={[0, 0.15, 0]} rotation={[0, -0.4, 0]} castShadow>
        <cylinderGeometry args={[0.12, 0.12, 1.8, 6]} />
        <meshStandardMaterial color="#2a1808" roughness={0.9} />
      </mesh>
      {/* Flame glow */}
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
```

- [ ] **Step 2: Add `Landmarks` to `ForestWorld.tsx` inside `<Physics>`**

```tsx
import { Landmarks } from './Landmarks'
// inside <Physics>:
<Landmarks />
```

- [ ] **Step 3: Run dev — walk to each zone, verify landmark geometry and zone prompt**

Expected: cabin visible at origin, ruins east, waterfall north, grove northwest, clearing southeast, campfire south. Each triggers zone prompt on approach.

- [ ] **Step 4: Commit**

```bash
git add components/world/Landmarks.tsx components/world/ForestWorld.tsx
git commit -m "feat: landmark geometry for all 6 zones with colored point lights"
```

---

## Phase 9 — Polish + SEO

### Task 19: SEO + meta + .gitignore cleanup

**Files:**
- Modify: `app/layout.tsx`
- Modify: `.gitignore`

- [ ] **Step 1: Update metadata in `app/layout.tsx`**

```tsx
export const metadata: Metadata = {
  title: 'Vikas Singh Rawat — Full-Stack Engineer',
  description:
    'Full-stack engineer at Outbox Labs. Building ColdStats, shipping ReachInbox. Available for senior / mid full-stack roles.',
  keywords: [
    'Vikas Singh Rawat', 'Full-stack engineer', 'MERN developer',
    'Next.js engineer', 'ColdStats', 'ReachInbox', 'Outbox Labs',
    'Bangalore developer', 'TypeScript engineer',
  ],
  openGraph: {
    title: 'Vikas Singh Rawat — Full-Stack Engineer',
    description: 'Full-stack engineer at Outbox Labs. Building ColdStats. Open to opportunities.',
    locale: 'en_IN',
    type: 'website',
  },
}
```

- [ ] **Step 2: Final test run**

```bash
npm test && npm run build
```

Expected: all tests pass, build succeeds with no errors.

- [ ] **Step 3: Final commit**

```bash
git add app/layout.tsx
git commit -m "feat: SEO metadata, OG tags"
```

---

## Self-Review Checklist

- [x] **Spec coverage:** Architecture ✓, World map 6 zones ✓, Hunter WASD ✓, Third-person camera ✓, Weather 4 states ✓, Animals flee AI ✓, Zone sensors ✓, Zone panels all 6 ✓, Audio Howler ✓, Loading screen ✓, Landmark geometry ✓, SEO ✓
- [x] **No placeholders:** All code steps complete. Sound files require manual download (noted explicitly in Task 16).
- [x] **Type consistency:** `ZoneId`, `WeatherState` defined in `lib/store.ts` and imported consistently. `RapierRigidBody` from `@react-three/rapier`. `AnimalKind` defined in `Animal.tsx` and imported in `AnimalSpawner.tsx`.
- [x] **Method names consistent:** `setActiveZone`, `enterZone`, `exitZone`, `setWeather`, `toggleMute`, `setLoaded` — same names used in HUD, ZonePanel, LoadingScreen, audio.ts, weatherCycle.ts.
- [x] **One gap noted:** Blender .glb models are listed in spec but procedural geometry is used throughout as placeholder. A separate Blender MCP session should generate and swap in the actual models after this plan completes.
