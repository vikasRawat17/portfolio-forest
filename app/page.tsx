'use client'
import dynamic from 'next/dynamic'
import { useEffect } from 'react'
import { useGameStore } from '@/lib/store'
import { initAudio, setWeatherAudio, setMuted } from '@/lib/audio'
import { HUD } from '@/components/ui/HUD'
import { ZonePanel } from '@/components/ui/ZonePanel'
import { LoadingScreen } from '@/components/ui/LoadingScreen'

const ForestWorld = dynamic(() => import('@/components/world/ForestWorld'), {
  ssr: false,
  loading: () => <div style={{ width: '100vw', height: '100vh', background: '#08080c' }} />,
})

export default function Home() {
  const weather = useGameStore((s) => s.weather)
  const muted   = useGameStore((s) => s.muted)
  const loaded  = useGameStore((s) => s.loaded)

  useEffect(() => {
    if (loaded) initAudio()
  }, [loaded])

  useEffect(() => {
    setWeatherAudio(weather)
  }, [weather])

  useEffect(() => {
    setMuted(muted)
  }, [muted])

  return (
    <>
      {!loaded && <LoadingScreen />}
      <ForestWorld />
      <HUD />
      <ZonePanel />
    </>
  )
}
