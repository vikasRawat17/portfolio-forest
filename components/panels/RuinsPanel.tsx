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
