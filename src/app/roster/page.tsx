import dynamic from 'next/dynamic'
import { Suspense } from 'react'

const Roster = dynamic(() => import('@/components/Roster'), {
  loading: () => <p>Loading...</p>,
})

export default function RosterPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Roster />
    </Suspense>
  )
}