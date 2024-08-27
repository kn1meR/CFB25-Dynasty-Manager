import dynamic from 'next/dynamic'
import { Suspense } from 'react'

const RecruitingClassTracker = dynamic(() => import('@/components/RecruitingClassTracker'), {
  loading: () => <p>Loading...</p>,
})

export default function RecruitingPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RecruitingClassTracker />
    </Suspense>
  )
}