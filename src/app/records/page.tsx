import dynamic from 'next/dynamic'
import { Suspense } from 'react'

const Records = dynamic(() => import('@/components/Records'), {
  loading: () => <p>Loading...</p>,
})

export default function RecordsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Records />
    </Suspense>
  )
}