import { statusPageFetcher } from "@/lib/fetcher"
import { transformBackendResponse, transformBackendIncidents, type BackendStatusPageResponse } from "@/components/status/types"
import { StatusBanner } from "@/components/status/status-banner"
import { ComponentsListEnhanced } from "@/components/status/components-list-enhanced"  
import { IncidentFeedWrapper } from "@/components/status/incident-feed-wrapper"
import { StatusPageHeader } from "@/components/status/status-page-header"
import { StatusPageProvider } from "@/components/status/status-page-provider"
import { notFound } from "next/navigation"
import Image from "next/image"

export const dynamic = "force-dynamic"
export const revalidate = 60 // Revalidate every 60 seconds

interface StatusPageProps {
  params: Promise<{ slug: string }>
}

export default async function StatusPage({ params }: StatusPageProps) {
  const { slug } = await params
  
  try {
    // Fetch all data server-side
    const backendData = await statusPageFetcher<BackendStatusPageResponse>(slug)
    
    // Transform data for frontend
    const statusData = transformBackendResponse(backendData)
    const incidentsData = transformBackendIncidents(backendData)
    
    return (
      <StatusPageProvider statusData={statusData} incidentsData={incidentsData}>
        <main className="min-h-dvh bg-gray-50/50">
          {/* Header */}
          <StatusPageHeader slug={slug} />

          {/* Overall status banner */}
          <section aria-labelledby="overall-status" className="py-6 md:py-8">
            <StatusBanner slug={slug} />
          </section>

          {/* Content */}
          <section className="mx-auto max-w-5xl px-4 pb-16 space-y-8">
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
                  <Image 
                    src="/logo/light.svg" 
                    alt="Warrn" 
                    width={60}
                    height={20}
                    className="h-5 opacity-60"
                  />
                </div>
              </div>
            </div>
          </footer>
        </main>
      </StatusPageProvider>
    )
  } catch (error) {
    console.error(`Error fetching status page for slug ${slug}:`, error)
    // Return 404 if status page not found
    notFound()
  }
}
