import { NextResponse } from "next/server"

// Generate historical uptime data for battery charts
function generateUptimeHistory(componentId: string, status: string, days = 90): Array<{ date: string, status: string }> {
  const history = []
  const now = new Date()
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000)
    const dateStr = date.toISOString().split('T')[0]
    
    // Generate realistic status patterns based on component status
    let dayStatus = "operational"
    
    // Seed for deterministic patterns
    const seed = componentId.charCodeAt(0) + i
    
    if (status === "operational") {
      // 99.5-100% uptime - very few issues
      if (seed % 100 === 0) dayStatus = "degraded"
      else if (seed % 500 === 0) dayStatus = "outage"
    } else if (status === "degraded") {
      // 98-99% uptime - more frequent issues
      if (seed % 20 === 0) dayStatus = "degraded"
      else if (seed % 100 === 0) dayStatus = "outage"
    } else if (status === "maintenance") {
      // Scheduled maintenance periods
      if (seed % 30 === 0) dayStatus = "maintenance"
      else if (seed % 50 === 0) dayStatus = "degraded"
    } else if (status === "outage") {
      // More frequent outages
      if (seed % 10 === 0) dayStatus = "outage"
      else if (seed % 5 === 0) dayStatus = "degraded"
    }
    
    history.push({ date: dateStr, status: dayStatus })
  }
  
  return history
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const componentId = searchParams.get('component')
  const days = parseInt(searchParams.get('days') || '90')
  
  if (!componentId) {
    return NextResponse.json({ error: 'Component ID required' }, { status: 400 })
  }
  
  try {
    // TODO: Implement backend endpoint for component uptime history
    // For now, generate uptime based on current component status from backend
    
    // You can extend this to call your backend API:
    // const uptimeData = await backendFetcher(`/api/status-pages/public/${slug}/components/${componentId}/uptime/`)
    
    // For now, generate mock data based on the component ID
    const status = 'operational' // Default status for all components
    const history = generateUptimeHistory(componentId, status, days)
    
    return NextResponse.json({
      componentId,
      days,
      history,
      uptime: history.filter(h => h.status === 'operational').length / history.length * 100
    })
    
  } catch (error) {
    console.error("Error fetching uptime data:", error)
    
    // Fallback to operational status
    const history = generateUptimeHistory(componentId, 'operational', days)
    
    return NextResponse.json({
      componentId,
      days,
      history,
      uptime: 99.9 // Fallback uptime
    })
  }
}

