'use client'
import dynamic from 'next/dynamic'

const ForestWorld = dynamic(() => import('@/components/world/ForestWorld'), {
  ssr: false,
  loading: () => (
    <div style={{ width: '100vw', height: '100vh', background: '#08080c' }} />
  ),
})

export default function Home() {
  return <ForestWorld />
}
