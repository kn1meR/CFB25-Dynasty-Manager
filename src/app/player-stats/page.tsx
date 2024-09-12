// src/app/player-stats/page.tsx
import dynamic from 'next/dynamic'
import { Suspense } from 'react'

const PlayerStats = dynamic(() => import('@/components/PlayerStats'), {
  loading: () => <p>Loading...</p>,
})

export default function PlayerStatsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PlayerStats />
    </Suspense>
  )
}