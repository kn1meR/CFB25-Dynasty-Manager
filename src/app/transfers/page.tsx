import dynamic from 'next/dynamic'
import { Suspense } from 'react'

const TransferPortalTracker = dynamic(() => import('@/components/TransferPortalTracker'), {
  loading: () => <p>Loading...</p>,
})

export default function TransfersPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <TransferPortalTracker />
    </Suspense>
  )
}