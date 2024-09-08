// src/app/rankings/page.tsx
import dynamic from 'next/dynamic'
import { Suspense } from 'react'

const Top25Rankings = dynamic(() => import('@/components/Top25Rankings'), {
  loading: () => <p>Loading...</p>,
})

export default function RankingsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Top25Rankings />
    </Suspense>
  )
}