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
