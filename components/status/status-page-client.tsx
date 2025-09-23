"use client"

import { useEffect, useState } from 'react'
import { useAuth } from '@clerk/nextjs'
import { statusPageFetcher, checkStatusPageAuthRequirement } from "@/lib/fetcher"
import { transformBackendResponse, transformBackendIncidents, type BackendStatusPageResponse } from "@/components/status/types"
import { StatusBanner } from "@/components/status/status-banner"
import { ComponentsListEnhanced } from "@/components/status/components-list-enhanced"  
import { IncidentFeedWrapper } from "@/components/status/incident-feed-wrapper"
import { StatusPageHeader } from "@/components/status/status-page-header"
import { StatusPageProvider } from "@/components/status/status-page-provider"
import { AuthWrapper } from "@/components/auth/auth-wrapper"
import Image from "next/image"
import Link from "next/link"

interface StatusPageClientProps {
  slug: string
}

export function StatusPageClient({ slug }: StatusPageClientProps) {
  const { getToken, isLoaded } = useAuth()
  const [statusData, setStatusData] = useState<any>(null)
  const [incidentsData, setIncidentsData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadPrivateStatusPage() {
      try {
        // This client component is only used for private pages
        // Wait for Clerk to load
        if (!isLoaded) {
          return
        }
        
        const authToken = await getToken()
        if (!authToken) {
          // User is not authenticated, AuthWrapper will handle sign-in
          setLoading(false)
          return
        }

        // Fetch status page data with authentication
        const backendData = await statusPageFetcher<BackendStatusPageResponse>(slug, "", authToken)
        
        // Transform data for frontend
        const transformedStatusData = transformBackendResponse(backendData)
        const transformedIncidentsData = transformBackendIncidents(backendData)
        
        setStatusData(transformedStatusData)
        setIncidentsData(transformedIncidentsData)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load status page')
      } finally {
        setLoading(false)
      }
    }

    loadPrivateStatusPage()
  }, [slug, isLoaded, getToken])

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-dvh flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading status page...</p>
        </div>
      </div>
    )
  }

  // Handle errors
  if (error) {
    return (
      <div className="min-h-dvh flex items-center justify-center">
        <div className="text-center p-8">
          <h2 className="text-2xl font-semibold mb-4">Error Loading Status Page</h2>
          <p className="text-muted-foreground mb-6">{error}</p>
          <Link 
            href="https://warrn.io/status-pages"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            View all status pages
          </Link>
        </div>
      </div>
    )
  }

  const statusPageContent = statusData && incidentsData ? (
    <StatusPageProvider statusData={statusData} incidentsData={incidentsData}>
      <main className="min-h-dvh">
        {/* Header */}
        <StatusPageHeader slug={slug} />

        {/* Overall status banner */}
        <section aria-labelledby="overall-status" className="py-1">
          <StatusBanner slug={slug} />
        </section>

        {/* Content */}
        <section className="mx-auto max-w-5xl px-4 pb-16 space-y-8 mt-4">
          {/* 1) Active incidents first */}
          <div id="active-incidents" className="scroll-mt-20">
            <IncidentFeedWrapper mode="active" slug={slug} />
          </div>

          {/* 2) Components next */}
          <div id="components" className="scroll-mt-20">
            <ComponentsListEnhanced slug={slug} />
          </div>

          {/* 3) Resolved incidents last */}
          <div id="resolved" className="scroll-mt-20">
            <IncidentFeedWrapper mode="resolved" slug={slug} />
          </div>
        </section>

        <footer className="">
          <div className="mx-auto max-w-5xl px-4 py-8">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <span>Powered by</span>
                <Link
                  href="https://warrn.io/status-pages"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 hover:opacity-80 transition-opacity"
                >
                  <Image 
                    src="/logo/light.svg" 
                    alt="Warrn" 
                    width={60}
                    height={20}
                    className="h-5 opacity-60"
                  />
                </Link>
              </div>
            </div>
          </div>
        </footer>
      </main>
    </StatusPageProvider>
  ) : null

  return (
    <AuthWrapper requiresAuth={true} statusPageName={slug}>
      {statusPageContent}
    </AuthWrapper>
  )
}
