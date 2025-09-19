import { NextResponse } from "next/server"
import { statusPageFetcher } from "@/lib/fetcher"
import { transformBackendResponse, type BackendStatusPageResponse } from "@/components/status/types"

interface RouteParams {
  params: Promise<{ slug: string }>
}

export async function GET(request: Request, { params }: RouteParams) {
  try {
    const { slug } = await params
    
    // Fetch data from your backend API using the dynamic slug
    const backendData = await statusPageFetcher<BackendStatusPageResponse>(slug)
    
    // Transform to frontend format
    const transformedData = transformBackendResponse(backendData)
    
    return NextResponse.json({
      // existing fields for compatibility
      overallStatus: backendData.overall_status,
      summary: transformedData.summary,
      components: transformedData.components,
      lastUpdatedISO: transformedData.lastUpdated,
      // new enriched fields used by scoped components
      allOperational: transformedData.allOperational,
      severity: transformedData.severity,
      affectedComponentIds: transformedData.affectedComponentIds,
      lastUpdated: transformedData.lastUpdated,
    })
    
  } catch (error) {
    console.error("Error fetching status from backend:", error)
    
    // Fallback to mock data if backend is unavailable
    const mockComponents = [
      {
        id: "api",
        name: "API",
        status: "operational" as const,
        description: "REST + Webhooks",
        group: "Core",
        uptime90d: 100,
      },
      {
        id: "dashboard",
        name: "Dashboard", 
        status: "operational" as const,
        description: "Admin web app",
        group: "Apps",
        uptime90d: 99.98,
      }
    ]

    const fallbackData = {
      overallStatus: "operational",
      summary: "Backend unavailable - showing fallback data",
      components: mockComponents,
      lastUpdatedISO: new Date().toISOString(),
      allOperational: true,
      severity: "none" as const,
      affectedComponentIds: [],
      lastUpdated: new Date().toISOString(),
    }

    return NextResponse.json(fallbackData)
  }
}
