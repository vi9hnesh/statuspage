import { statusPageFetcher, checkStatusPageAuthRequirement } from "@/lib/fetcher"
import { transformBackendResponse, transformBackendIncidents, type BackendStatusPageResponse } from "@/components/status/types"
import { StatusBanner } from "@/components/status/status-banner"
import { ComponentsListEnhanced } from "@/components/status/components-list-enhanced"  
import { IncidentFeedWrapper } from "@/components/status/incident-feed-wrapper"
import { StatusPageHeader } from "@/components/status/status-page-header"
import { StatusPageProvider } from "@/components/status/status-page-provider"
import { AccessDenied } from "@/components/ui/access-denied"
import { redirect } from "next/navigation"
import { auth } from "@clerk/nextjs/server"
import { headers } from "next/headers"
import Image from "next/image"
import Link from "next/link"
export const dynamic = "force-dynamic"
export const revalidate = 60 // Revalidate every 60 seconds

interface StatusPageProps {
  params: Promise<{ slug: string }>
}

// Generate dynamic metadata based on the status page
export async function generateMetadata({ params }: StatusPageProps) {
  const { slug } = await params
  
  try {
    // Check if status page exists and get basic info for metadata
    const authCheck = await checkStatusPageAuthRequirement(slug)
    const statusPageName = authCheck.name || slug
    
    return {
      title: `${statusPageName} Status`,
      description: `Real-time status and performance monitoring for ${statusPageName}. Check system uptime, incidents, and service availability.`,
      openGraph: {
        title: `${statusPageName} Status`,
        description: `Monitor ${statusPageName} system status and performance in real-time`,
        type: 'website',
      },
      twitter: {
        card: 'summary',
        title: `${statusPageName} Status`,
        description: `Monitor ${statusPageName} system status and performance in real-time`,
      },
    }
  } catch (error) {
    // Fallback metadata if status page fetch fails
    return {
      title: `${slug} Status`,
      description: `Status page for ${slug}. Monitor system uptime and performance.`,
      openGraph: {
        title: `${slug} Status`,
        description: `Status page for ${slug}`,
        type: 'website',
      },
      twitter: {
        card: 'summary',
        title: `${slug} Status`,
        description: `Status page for ${slug}`,
      },
    }
  }
}

export default async function StatusPage({ params }: StatusPageProps) {
  const { slug } = await params
  
  try {
    // Check if authentication is required
    const authCheck = await checkStatusPageAuthRequirement(slug)
    
    if (!authCheck.exists) {
      redirect('https://warrn.io/status-pages')
    }
    
    // Get auth token if required (server-side)
    let authToken: string | null = null
    if (authCheck.requires_auth) {
      const { getToken } = await auth()
      authToken = await getToken()
      
      
      if (!authToken) {
        // Redirect to sign-in with return URL (works for both custom and regular domains)
        redirect(`/sign-in?return_url=${encodeURIComponent(`/${slug}`)}`)
      }
    }
    
    // Fetch data server-side (either with or without auth token)
    const backendData = await statusPageFetcher<BackendStatusPageResponse>(slug, "", authToken || undefined)
    const statusData = transformBackendResponse(backendData)
    const incidentsData = transformBackendIncidents(backendData)
    
    return (
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
    )
  } catch (error) {
    // Handle different error types gracefully
    if (error instanceof Error) {
      // 403 Forbidden - user is authenticated but not authorized for this org's status page
      if (error.message.includes('403') || error.message.includes('Forbidden')) {
        const authCheck = await checkStatusPageAuthRequirement(slug).catch(() => ({ exists: false, name: null }))
        return <AccessDenied statusPageName={authCheck.name || slug} />
      }
      
      // 401 Authentication required - redirect to sign-in
      if (error.message.includes('Authentication required')) {
        redirect(`/sign-in?return_url=${encodeURIComponent(`/${slug}`)}`)
      }
      
      // 404 Status page not found - redirect to main site
      if (error.message.includes('404') || error.message.includes('Status page not found')) {
        redirect('https://warrn.io/status-pages')
      }
    }
    
    // For other errors, let them bubble up or provide a fallback
    throw error
  }
}
