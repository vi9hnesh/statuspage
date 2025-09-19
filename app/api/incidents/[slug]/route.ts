import { NextResponse } from "next/server"
import { statusPageFetcher } from "@/lib/fetcher"
import { transformBackendIncidents, type BackendStatusPageResponse } from "@/components/status/types"

interface RouteParams {
  params: Promise<{ slug: string }>
}

export async function GET(request: Request, { params }: RouteParams) {
  try {
    const { slug } = await params
    
    // Fetch data from your backend API using the dynamic slug
    const backendData = await statusPageFetcher<BackendStatusPageResponse>(slug)
    
    // Transform incidents to frontend format
    const incidents = transformBackendIncidents(backendData)
    
    return NextResponse.json(incidents)
    
  } catch (error) {
    console.error("Error fetching incidents from backend:", error)
    
    // Fallback to mock data if backend is unavailable
    const now = new Date()
    const minus = (mins: number) => new Date(now.getTime() - mins * 60_000).toISOString()

    const fallbackData = {
      active: [],
      resolved: [
        {
          id: "mock_inc_1",
          title: "Backend API Unavailable",
          state: "resolved" as const,
          startedAt: minus(60),
          resolvedAt: minus(30),
          severity: "minor" as const,
          affectedComponentIds: ["backend"],
          updates: [
            { ts: minus(60), body: "Backend API is currently unavailable. Using mock data." },
            { ts: minus(30), body: "This is mock incident data for demonstration." },
          ],
        },
      ]
    }

    return NextResponse.json(fallbackData)
  }
}
