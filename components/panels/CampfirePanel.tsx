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
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 40, maxWidth: 400 }}>
        {[
          { label: 'Email',    value: 'rawatvikas17jan@gmail.com',      href: 'mailto:rawatvikas17jan@gmail.com', color: '#ff7a3d' },
          { label: 'GitHub',   value: 'github.com/vikasRawat17',        href: 'https://github.com/vikasRawat17',  color: '#f5f5f7' },
          { label: 'LinkedIn', value: 'in/vikassinghrawat17',            href: 'https://www.linkedin.com/in/vikassinghrawat17', color: '#0ea5e9' },
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
      <a href="/resume.pdf" download="vikas_resume.pdf" style={{
        display: 'inline-block',
        background: 'linear-gradient(120deg, #ff7a3d, #e11d74)',
        color: '#fff', padding: '12px 28px', borderRadius: 8,
        textDecoration: 'none', fontSize: 15, fontWeight: 600,
      }}>
        Download Resume ↓
      </a>
      <div style={{ marginTop: 48, paddingTop: 24, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
          {[
            ['Set in',     'Space Grotesk · JetBrains Mono'],
            ['Built with', 'Next.js · R3F · GSAP'],
            ['Hosted on',  'Vercel'],
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
