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
  const activeZone  = useGameStore((s) => s.activeZone)
  const enteredZone = useGameStore((s) => s.enteredZone)
  const enterZone   = useGameStore((s) => s.enterZone)
  const exitZone    = useGameStore((s) => s.exitZone)
  const muted       = useGameStore((s) => s.muted)
  const toggleMute  = useGameStore((s) => s.toggleMute)

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
