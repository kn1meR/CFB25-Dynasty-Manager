import dynamic from 'next/dynamic'
import { Suspense } from 'react'

const Roster = dynamic(() => import('@/components/SchedulePage'), {
  loading: () => <p>Loading...</p>,
})

export default function SchedulePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Roster />
    </Suspense>
  )
}