"use client"

import { useStatusPageData } from "./status-page-provider"
import { IncidentFeed } from "./incident-feed"
import type { IncidentsPayload } from "./types"

// Adapter function to convert our backend incidents to the format expected by IncidentFeed
function adaptIncidentForFeed(incident: any) {
  return {
    id: incident.id,
    title: incident.title,
    status: incident.state, // Convert 'state' to 'status'
    startedAt: incident.startedAt,
    resolvedAt: incident.resolvedAt,
    severity: incident.severity,
    affectedComponents: incident.affectedComponentIds || [], // Convert field name
    updates: incident.updates?.map((update: any) => ({
      at: update.ts, // Convert 'ts' to 'at'
      text: update.body // Convert 'body' to 'text'
    })) || []
  }
}

interface IncidentFeedWrapperProps {
  mode: "all" | "active" | "resolved"
  slug: string
}

export function IncidentFeedWrapper({ mode, slug }: IncidentFeedWrapperProps) {
  const { incidentsData } = useStatusPageData()

  const activeIncidents = (incidentsData.active || []).map(adaptIncidentForFeed)
  const resolvedIncidents = (incidentsData.resolved || []).map(adaptIncidentForFeed)

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
