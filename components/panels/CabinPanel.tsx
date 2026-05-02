export default function CabinPanel() {
  return (
    <div>
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

      <p style={{ color: '#d0d0d8', fontSize: 16, lineHeight: 1.7, marginBottom: 32, maxWidth: 640 }}>
        Full-stack engineer at Outbox Labs. Promoted from a 7-month internship to full-time after shipping
        ColdStats from an empty repo to paying customers. Strong on Next.js + Node.js + MongoDB; comfortable
        across the entire delivery surface — schema, API, UI, deploy.
      </p>

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

      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        {[
          { label: 'GitHub',   href: 'https://github.com/vikasRawat17', color: '#f5f5f7' },
          { label: 'LinkedIn', href: 'https://www.linkedin.com/in/vikassinghrawat17', color: '#0ea5e9' },
          { label: 'Resume',   href: '/resume.pdf', color: '#ff7a3d' },
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
