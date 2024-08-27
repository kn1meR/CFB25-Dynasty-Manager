import dynamic from 'next/dynamic'
import { Suspense } from 'react'

const AwardTracker = dynamic(() => import('@/components/AwardTracker'), {
  loading: () => <p>Loading...</p>,
})

export default function AwardsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AwardTracker />
    </Suspense>
  )
}