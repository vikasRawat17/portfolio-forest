'use client'
import dynamic from 'next/dynamic'
import { HUD } from '@/components/ui/HUD'

const ForestWorld = dynamic(() => import('@/components/world/ForestWorld'), { ssr: false })

export default function Home() {
  return (
    <>
      <ForestWorld />
      <HUD />
    </>
  )
}
