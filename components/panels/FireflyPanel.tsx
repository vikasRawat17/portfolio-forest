'use client'
import { useState } from 'react'

type Skill = { name: string; years: string; note?: string; level: 'daily' | 'comfortable' | 'learning' }

const SKILLS: Skill[] = [
  { name: 'TypeScript',     years: '3y',      note: 'Default for everything I ship.',              level: 'daily'       },
  { name: 'Next.js',        years: '2y',      note: 'App Router, Server actions, Route handlers.',  level: 'daily'       },
  { name: 'React',          years: '3y',      note: 'Hooks, suspense, server components.',          level: 'daily'       },
  { name: 'Node.js',        years: '3y',      note: 'API design, queues, integrations.',            level: 'daily'       },
  { name: 'MongoDB',        years: '2y',      note: 'Indexes earn their keep.',                     level: 'daily'       },
  { name: 'Tailwind',       years: '2y',      note: 'Tokens over utilities.',                       level: 'daily'       },
  { name: 'Express',        years: '2y',      note: 'REST APIs, middleware pipelines.',             level: 'comfortable' },
  { name: 'Socket.io',      years: '1y',      note: 'Real-time chat in SkillSwap.',                level: 'comfortable' },
  { name: 'Firebase',       years: '1y',      note: 'Auth + Firestore for quick prototypes.',       level: 'comfortable' },
  { name: 'Redux',          years: '2y',      note: 'Redux-Persist for session state.',             level: 'comfortable' },
  { name: 'Framer Motion',  years: '1y',      note: 'Micro-interactions that earn compute.',        level: 'comfortable' },
  { name: 'MySQL',          years: '1y',                                                            level: 'comfortable' },
  { name: 'GSAP',           years: 'now',     note: 'Scroll choreography.',                        level: 'learning'    },
  { name: 'Three.js / R3F', years: 'now',     note: 'Web 3D / shaders.',                           level: 'learning'    },
  { name: 'System Design',  years: 'ongoing', note: 'Microservices, queues, scaling.',             level: 'learning'    },
  { name: 'DSA / C++',      years: 'ongoing', note: 'LeetCode grind.',                             level: 'learning'    },
]

const LEVEL_STYLE: Record<Skill['level'], { dot: string; bg: string; border: string }> = {
  daily:       { dot: '#ff7a3d', bg: 'rgba(255,122,61,0.08)',   border: 'rgba(255,122,61,0.25)'  },
  comfortable: { dot: '#e11d74', bg: 'rgba(225,29,116,0.08)',   border: 'rgba(225,29,116,0.2)'   },
  learning:    { dot: '#5b3df5', bg: 'rgba(91,61,245,0.08)',    border: 'rgba(91,61,245,0.2)'    },
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
      <div style={{ display: 'flex', gap: 20, marginBottom: 32 }}>
        {(['daily', 'comfortable', 'learning'] as const).map((l) => (
          <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: LEVEL_STYLE[l].dot }} />
            <span style={{ color: '#a0a0aa', fontSize: 13 }}>{LEVEL_LABEL[l]}</span>
          </div>
        ))}
      </div>
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
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: st.dot, boxShadow: `0 0 6px ${st.dot}` }} />
              <span style={{ color: '#f5f5f7', fontSize: 14 }}>{s.name}</span>
              <span style={{ color: '#60606a', fontSize: 11 }}>{s.years}</span>
            </button>
          )
        })}
      </div>
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
