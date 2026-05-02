'use client'
import { useEffect, useRef, useState } from 'react'
import { useGameStore } from '@/lib/store'
import { gsap } from 'gsap'

export function LoadingScreen() {
  const setLoaded    = useGameStore((s) => s.setLoaded)
  const [progress, setProgress] = useState(0)
  const [ready,    setReady]    = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

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
      <div style={{
        fontSize: 'clamp(18px, 3vw, 28px)', fontWeight: 700, marginBottom: 48,
        background: 'linear-gradient(120deg, #ff7a3d, #e11d74 50%, #5b3df5)',
        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
      }}>
        [vsr.dev]
      </div>
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
