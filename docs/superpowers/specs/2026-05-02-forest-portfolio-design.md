# Forest Portfolio — Design Spec
**Date:** 2026-05-02  
**Subject:** vikas-singh-rawat-web — 3D interactive forest portfolio  
**Owner:** Vikas Singh Rawat  

---

## Overview

Interactive 3D portfolio site where the visitor explores a dark forest as a hunter. Six landmark zones each contain a portfolio section. Animals roam and react to the hunter. Weather cycles randomly. Desktop-only. Built on Next.js 16 + React Three Fiber.

Inspired by Bruno Simon's car portfolio but completely different: forest biome, hunter character, third-person camera, ambient nature audio, Rapier physics throughout.

---

## Tech Stack

| Library | Role |
|---|---|
| Next.js 16 (App Router) | Framework, routing, SSR shell |
| React 19 | Component model |
| `@react-three/fiber` | R3F — Three.js React renderer |
| `@react-three/drei` | Helpers: `useGLTF`, `Sky`, `Stars`, `Fog`, `Environment`, `InstancedMesh` |
| `@react-three/rapier` | Physics: rigid bodies, colliders, sensors, joints |
| `zustand` | Game state (weather, active zone, hunter position) |
| `gsap` | Camera transitions, UI panel animations |
| `howler.js` | Ambient audio, weather-reactive sound layers |
| Tailwind CSS 4 | UI panel styling |
| TypeScript 5 | Strict typing throughout |

---

## Project Structure

```
app/
  page.tsx                    ← mounts <ForestWorld />, no SSR
  layout.tsx                  ← meta, fonts (Space Grotesk, JetBrains Mono), global styles

components/
  world/
    ForestWorld.tsx            ← R3F Canvas root + Physics world wrapper
    Terrain.tsx                ← ground mesh, dirt paths, water plane
    Sky.tsx                    ← dynamic sky, stars, moon, weather-driven color lerp
    Fog.tsx                    ← volumetric fog density driven by weather state
    Vegetation.tsx             ← instanced trees (8 variants), rocks (5 variants), foliage, mushrooms
    Particles.tsx              ← rain particle system (1500 instances), falling leaves
  hunter/
    Hunter.tsx                 ← player character, WASD input → Rapier RigidBody velocity
    HunterCamera.tsx           ← spring third-person camera, ~45° behind+above
  animals/
    AnimalSpawner.tsx          ← places all animal instances at spawn positions
    Animal.tsx                 ← single animal: idle wander → flee AI + physics
  zones/
    ZoneManager.tsx            ← detects hunter in Rapier sensor zones → zustand activeZone
    CabinZone.tsx
    RuinsZone.tsx
    WaterfallZone.tsx
    GroveZone.tsx
    FireflyZone.tsx
    CampfireZone.tsx
  ui/
    LoadingScreen.tsx          ← progress bar, forest ambience starts, "Enter Forest" button
    ZonePanel.tsx              ← fullscreen content overlay (slides in on zone enter)
    HUD.tsx                    ← "[E] Enter" prompt, mute toggle
  panels/
    CabinPanel.tsx             ← About content
    RuinsPanel.tsx             ← Production projects (Outbox Labs)
    WaterfallPanel.tsx         ← ColdStats spotlight
    GrovePanel.tsx             ← Experimental projects
    FireflyPanel.tsx           ← Skills constellation
    CampfirePanel.tsx          ← Contact

lib/
  store.ts                    ← zustand store (see Data Model)
  weatherCycle.ts             ← random weather state machine + transition timing
  audio.ts                    ← howler.js setup, layer management

public/
  models/                     ← .glb files (all Blender-generated)
    hunter.glb
    deer.glb  fox.glb  rabbit.glb  owl.glb  wolf.glb
    cabin.glb  ruins.glb  waterfall-shrine.glb
    mushroom-grove.glb  campfire.glb
    tree-a.glb … tree-h.glb  (8 variants)
    rock-a.glb … rock-e.glb  (5 variants)
  sounds/
    forest-night.mp3          ← base ambient loop
    rain-loop.mp3
    thunder-1.mp3  thunder-2.mp3  thunder-3.mp3
    wind-eerie.mp3
    waterfall.mp3
    fire-crackle.mp3
```

---

## Data Model (Zustand Store)

```ts
type WeatherState = 'clear' | 'fog' | 'rain' | 'storm'
type ZoneId = 'cabin' | 'ruins' | 'waterfall' | 'grove' | 'firefly' | 'campfire' | null

interface GameStore {
  weather: WeatherState
  setWeather: (w: WeatherState) => void

  activeZone: ZoneId          // hunter is inside this sensor
  enteredZone: ZoneId         // zone whose panel is currently open
  setActiveZone: (z: ZoneId) => void
  enterZone: (z: ZoneId) => void
  exitZone: () => void

  muted: boolean
  toggleMute: () => void

  loaded: boolean             // all assets loaded
  setLoaded: () => void
}
```

---

## World Map

Tight ~120×120 unit world. All zones reachable within ~20 seconds of walking from spawn.

```
             [Waterfall Shrine]
                  (north)
                     |
   [Mushroom Grove]  |  [Ancient Ruins]
      (northwest)  [Hunter's Cabin]  (east)
                   (center/spawn)
                     |
              [Firefly Clearing] [Campfire]
                (southeast)      (south)
```

### Zone Assignments

| Zone | Location | Portfolio Section | Landmark |
|---|---|---|---|
| Hunter's Cabin | Center — spawn point | About Vikas | Mossy log cabin, warm light |
| Waterfall Shrine | North | ColdStats spotlight | Rock face + waterfall + shrine stone |
| Ancient Ruins | East | Outbox Labs production work | Stone columns, ivy, crumbled walls |
| Mushroom Grove | Northwest | Experimental projects | Giant glowing mushrooms, dense undergrowth |
| Firefly Clearing | Southeast | Skills / Stack | Open meadow, tall grass, fireflies |
| Campfire | South | Contact | Stone ring, log seats, flame |

### Animals

| Animal | Spawn Area | Idle Behaviour |
|---|---|---|
| Deer (2x) | Near cabin + forest centre | Grazes slowly |
| Fox (1x) | East path toward ruins | Patrols path |
| Rabbit (3x) | Grove + clearing | Hops in place |
| Owl (1x) | Perched on ruins stone | Still, head rotates |
| Wolf (1x) | Deep forest, far from all zones | Slow wander |

All flee when hunter enters 8-unit radius (owl: 3 units). Flee = `setLinvel` away + ±30° random offset, 3s then return to idle.

---

## Hunter System

- **Model:** hooded leather hunter, bow + quiver on back, ~3k poly, Mixamo-compatible rig
- **Physics:** Rapier `CapsuleCollider` + `RigidBody` (locked rotation axes)
- **Movement:** WASD → `setLinvel` each frame. Walk speed: 5 u/s. Shift = sprint 9 u/s.
- **Animations:** idle, walk, run — driven by velocity magnitude via `useAnimations`
- **Collision:** trees, rocks, landmark structures all have Rapier `CuboidCollider`/`TrimeshCollider`

---

## Camera System

- **Type:** Third-person, ~45° above and behind hunter
- **Follow:** `THREE.Vector3.lerp(targetOffset, 0.08)` each frame — spring lag = cinematic weight
- **Offset:** `(0, 4, 8)` relative to hunter (adjustable)
- **LookAt:** hunter position + `(0, 1, 0)` (head height)
- **Zone entry:** GSAP dolly forward into landmark over 0.8s `expo` ease, canvas filter desaturates

---

## Weather System

Four states cycling randomly via `weatherCycle.ts`:

| State | Sky | Fog | Rain | Lighting | Audio |
|---|---|---|---|---|---|
| `clear` | Stars + moon, blue-black | None | None | Cool blue ambient, fireflies active | forest-night |
| `fog` | Overcast, low moon | High density (~30u visibility) | None | Eerie green fill light | forest-night + wind-eerie |
| `rain` | Overcast, no stars | Light | 1500-particle system | Dimmer ambient | forest-night + rain-loop |
| `storm` | Black, lightning flashes | Medium | Heavy particles | Lightning point-light spike | forest-night + rain-loop + thunder one-shots |

- Transition interval: random 60–180s
- Crossfade duration: 8s via GSAP timeline
- Sky colors, fog density, directional light intensity/color all lerp during transition
- Fireflies (`InstancedMesh`) opacity driven by `clear` state only

---

## Zone Entry System

1. Hunter walks into invisible Rapier `sensor` cuboid around landmark
2. `ZoneManager` fires `setActiveZone(id)` → HUD shows `[E] Enter` prompt
3. User presses E:
   - GSAP: camera dollies forward into landmark (0.8s, `expo` ease)
   - Canvas CSS filter: `blur(4px) brightness(0.6)` over 0.4s
   - `ZonePanel` fades in over blurred canvas
4. User presses ESC:
   - Panel fades out
   - Canvas filter clears
   - Camera pulls back to follow offset
   - `exitZone()` called

---

## Content Panels

All panels use design tokens: `#08080C` background, `Space Grotesk` display font, orange→pink→purple gradient accents (`#FF7A3D → #E11D74 → #5B3DF5`).

### Hunter's Cabin — About
- Hero: name + title ("Full-Stack Engineer") with gradient text
- Bio paragraph (from `summary.profile`)
- Current role card: Outbox Labs, Feb 2026–present, promoted badge
- Experience timeline: Outbox Labs FT → Intern → Coding Ninjas → M.Sc
- Availability badge: green dot + "Open to senior / mid full-stack roles · 2026"

### Waterfall Shrine — ColdStats Spotlight
- Hero: ColdStats logo/name + tagline
- "Founding engineer" story — empty repo → paying customers
- Feature highlights: multi-platform connectors, AI monitoring, deliverability automation
- Tech stack chips: Next.js, Node.js, TypeScript, MongoDB, AI
- Live link: `app.coldstats.ai`

### Ancient Ruins — Production Projects
- Project cards (3): ReachInbox, MailVerify, Zapamail
- Each card: title, role, highlights (2–3 bullets), tags
- ReachInbox metrics: 500M+ emails, $2.5B+ pipeline, G2 4.6/5

### Mushroom Grove — Experimental Projects
- Project cards (3): SkillSwap, Crypto Tracker, Routine Management
- Each: tagline, tech tags, GitHub link, key metric/highlight

### Firefly Clearing — Skills
- Interactive constellation: each firefly dot = one skill
- Hover → tooltip: skill name, years, note
- Grouped by proficiency: daily (brightest), comfortable (medium), learning (dim/pulsing)
- Skills list from `skills.daily`, `skills.comfortable`, `skills.learning`

### Campfire — Contact
- Email: rawatvikas17jan@gmail.com
- GitHub: github.com/vikasRawat17
- LinkedIn: linkedin.com/in/vikassinghrawat17
- Availability note + preferred contact
- Resume download button → `/resume.pdf`
- Simple contact message form (mailto: fallback, no backend needed)

---

## Audio System

```ts
// Layered via Howler.js
layers = {
  base: 'forest-night.mp3',      // always playing
  rain: 'rain-loop.mp3',         // fade in: rain + storm
  wind: 'wind-eerie.mp3',        // fade in: fog
  waterfall: 'waterfall.mp3',    // positional, near WaterfallZone
  fire: 'fire-crackle.mp3',      // positional, near CampfireZone
}
// Thunder: random one-shots during storm (interval 8–25s)
```

Weather transition → GSAP crossfade audio layers (0.8s).  
Mute toggle in HUD kills all Howler volumes instantly.

---

## Loading Screen

- Dark `#08080C` screen
- Centered: `[vsr.dev]` brand mark (gradient text)
- Forest ambience begins at 20% load volume, fades to full
- Progress bar (thin, gradient: orange→pink→purple)
- "Enter Forest" button appears at 100% load
- Click → fade to black → forest spawns → camera starts above hunter, drops to follow offset over 1.2s

---

## Models Strategy (Blender MCP)

All models generated via Blender MCP connection, exported as `.glb`:

- Hunter character: hooded, leather armor, bow on back, quiver, Mixamo rig for animations
- Animals (5 species): low–mid poly, simple idle + flee rigs
- Landmarks (6): cabin, ruins columns, waterfall rock face + water plane, mushroom cluster, campfire ring, shrine stone
- Vegetation: 8 tree variants (pine/oak silhouettes), 5 rock variants — all exported for instancing
- Foliage: grass patches, ferns, fallen logs for ground detail

Poly budget: hunter ~3k, animals ~1–2k each, landmarks ~2–5k each, vegetation ~200–500 each (instanced ×50–200).

---

## Design Tokens (from portfolio data)

```
canvas:       #08080C
surface:      #0F0F14
raised:       #16161E
fg:           #F5F5F7
muted:        #A0A0AA
g1:           #FF7A3D
g2:           #E11D74
g3:           #5B3DF5
gradient:     linear-gradient(120deg, #FF7A3D, #E11D74 50%, #5B3DF5)
font-display: Space Grotesk
font-body:    Inter
font-mono:    JetBrains Mono
```

---

## Out of Scope

- Mobile / touch support (desktop-only)
- Mini-map HUD
- Blog / writing section
- Backend / API routes (contact form uses mailto:)
- PostMagnet (removed by user request)
- First-person camera mode
