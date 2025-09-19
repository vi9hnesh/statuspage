export async function jsonFetcher<T = any>(url: string): Promise<T> {
  const res = await fetch(url, { cache: "no-store" })
  if (!res.ok) {
    throw new Error(`Request failed: ${res.status}`)
  }
  return res.json()
}

// Enhanced fetcher for backend API calls
export async function backendFetcher<T = any>(endpoint: string): Promise<T> {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000'
  const url = `${baseUrl}${endpoint}`
  
  const res = await fetch(url, { 
    cache: "no-store",
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    }
  })
  
  if (!res.ok) {
    throw new Error(`Backend request failed: ${res.status} ${res.statusText}`)
  }
  
  return res.json()
}

// Status page specific fetcher that uses slug parameter
export async function statusPageFetcher<T = any>(slug: string, endpoint: string = ""): Promise<T> {
  const fullEndpoint = `/api/status-pages/public/${slug}/${endpoint}`.replace(/\/+$/, '/') // Ensure trailing slash
  
  return backendFetcher<T>(fullEndpoint)
}
