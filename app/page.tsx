'use client'
import dynamic from 'next/dynamic'
import { HUD } from '@/components/ui/HUD'
import { ZonePanel } from '@/components/ui/ZonePanel'

const ForestWorld = dynamic(() => import('@/components/world/ForestWorld'), { ssr: false })

export default function Home() {
  return (
    <>
      <ForestWorld />
      <HUD />
      <ZonePanel />
    </>
  )
}
