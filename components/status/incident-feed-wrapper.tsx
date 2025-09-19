"use client"

import { useStatusPageData } from "./status-page-provider"
import { IncidentFeed } from "./incident-feed"
// No local types or adapters; use the shapes from `./types` via context

interface IncidentFeedWrapperProps {
  mode: "all" | "active" | "resolved"
  slug: string
}

export function IncidentFeedWrapper({ mode }: IncidentFeedWrapperProps) {
  const { incidentsData } = useStatusPageData()

  const activeIncidents = incidentsData.active || []
  const resolvedIncidents = incidentsData.resolved || []

  // Hide active incidents section if no active incidents
  if (mode === "active" && activeIncidents.length === 0) {
    return null
  }

  // For resolved incidents, show as a "View history" button if there are resolved incidents
  if (mode === "resolved" && resolvedIncidents.length > 0) {
    return (
      <div className="text-center">
        <button className="inline-flex items-center gap-2 px-4 py-2 text-sm bg-muted hover:bg-muted/80 rounded-md transition-colors">
          <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
            <line x1="16" y1="2" x2="16" y2="6"/>
            <line x1="8" y1="2" x2="8" y2="6"/>
            <line x1="3" y1="10" x2="21" y2="10"/>
          </svg>
          View history
        </button>
      </div>
    )
  }

  // Hide resolved section if no resolved incidents
  if (mode === "resolved" && resolvedIncidents.length === 0) {
    return null
  }

  return (
    <IncidentFeed
      active={activeIncidents}
      resolved={resolvedIncidents}
      mode={mode}
    />
  )
}
