import dynamic from 'next/dynamic'
import { Suspense } from 'react'

const TrophyCase = dynamic(() => import('@/components/TrophyCase'), {
  loading: () => <p>Loading...</p>,
})

export default function TrophyCasePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <TrophyCase />
    </Suspense>
  )
}