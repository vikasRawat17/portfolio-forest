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
