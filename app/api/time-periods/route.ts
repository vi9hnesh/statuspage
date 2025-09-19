import { NextResponse } from "next/server"

// Generate available time periods for the battery chart navigation
export async function GET() {
  const now = new Date()
  const periods = []
  
  // Generate last 6 months of periods
  for (let i = 0; i < 6; i++) {
    const startDate = new Date(now.getFullYear(), now.getMonth() - i - 2, 1)
    const endDate = new Date(now.getFullYear(), now.getMonth() - i, 0)
    
    const startMonth = startDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    const endMonth = endDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    
    periods.push({
      id: `${startDate.getFullYear()}-${String(startDate.getMonth() + 1).padStart(2, '0')}`,
      label: `${startMonth} - ${endMonth}`,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      isCurrent: i === 0
    })
  }
  
  return NextResponse.json({
    periods,
    current: periods[0]
  })
}

