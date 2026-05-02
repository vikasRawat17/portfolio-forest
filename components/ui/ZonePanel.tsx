'use client'
import { useEffect, useRef } from 'react'
import { useGameStore } from '@/lib/store'
import { gsap } from 'gsap'
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
