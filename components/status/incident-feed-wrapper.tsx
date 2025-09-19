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

  return (
    <IncidentFeed
      active={activeIncidents}
      resolved={resolvedIncidents}
      mode={mode}
    />
  )
}
