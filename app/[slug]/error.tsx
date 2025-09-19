'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Status page error:', error)
  }, [error])

  return (
    <div className="min-h-dvh flex items-center justify-center bg-gray-50/50">
      <div className="text-center p-8">
        <h2 className="text-2xl font-semibold mb-4">Something went wrong!</h2>
        <p className="text-muted-foreground mb-6">
          There was an error loading this status page.
        </p>
        <div className="space-x-4">
          <Button onClick={reset}>Try again</Button>
          <Button 
            variant="outline" 
            onClick={() => window.location.href = 'https://warrn.io/status-pages'}
          >
            View all status pages
          </Button>
        </div>
      </div>
    </div>
  )
}
