import dynamic from 'next/dynamic'
import { Suspense } from 'react'

const TeamHome = dynamic(() => import('@/components/TeamHome'), {
  loading: () => <p>Loading...</p>,
})

export default function Home() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <TeamHome />
    </Suspense>
  )
}