// Frontend types (keep for compatibility)
export type ComponentStatus = "operational" | "degraded_performance" | "partial_outage" | "major_outage" | "maintenance"
export type IncidentState = "investigating" | "identified" | "monitoring" | "resolved"
export type Severity = "none" | "minor" | "major"

// Backend API response types (matching your Django API)
export interface BackendStatusComponent {
  id: string
  name: string
  description?: string
  status: ComponentStatus
  uptime_percentage_90d: string // Decimal as string from backend
}

export interface BackendIncident {
  id: string
  title: string
  status: IncidentState
  impact: "none" | "minor" | "major" | "critical"
  started_at: string // ISO
  resolved_at?: string // ISO
  affected_components: string[] // Component names
}

export interface BackendStatusPageResponse {
  name: string
  description?: string
  overall_status: "operational" | "degraded_performance" | "partial_outage" | "major_outage"
  logo_url?: string
  primary_color: string
  support_email?: string
  support_url?: string
  components: BackendStatusComponent[]
  active_incidents: BackendIncident[]
  recent_incidents: BackendIncident[]
  last_updated: string // ISO
}

// Frontend component types (transformed from backend)
export interface StatusComponent {
  id: string
  name: string
  status: ComponentStatus
  group?: string
  uptime90d?: number // percentage (0-100)
  description?: string
  subComponents?: StatusComponent[]
}

export interface StatusSummary {
  allOperational: boolean
  severity: Severity
  summary: string
  affectedComponentIds: string[]
  lastUpdated: string // ISO
  components: StatusComponent[]
  // Additional fields from backend
  name: string
  description?: string
  logo_url?: string
  primary_color: string
  support_email?: string
  support_url?: string
}

export interface IncidentUpdate {
  ts: string // ISO
  body: string
  status?: IncidentState
}

export interface Incident {
  id: string
  title: string
  state: IncidentState
  startedAt: string // ISO
  resolvedAt?: string // ISO
  severity: "maintenance" | "minor" | "major"
  affectedComponentIds: string[]
  updates: IncidentUpdate[]
}

export interface IncidentsPayload {
  active: Incident[]
  resolved: Incident[]
}

// Utility functions to transform backend data to frontend format
export function transformBackendResponse(data: BackendStatusPageResponse): StatusSummary {
  const components: StatusComponent[] = data.components.map(comp => ({
    id: comp.id,
    name: comp.name,
    status: comp.status,
    description: comp.description,
    uptime90d: parseFloat(comp.uptime_percentage_90d),
    group: "Services" // You can enhance this based on service metadata
  }))

  const hasOutage = data.overall_status === "major_outage" || data.overall_status === "partial_outage"
  const hasIssues = data.overall_status === "degraded_performance"
  const severity: Severity = hasOutage ? "major" : hasIssues ? "minor" : "none"

  const summary = data.overall_status === "operational"
    ? "All systems operational."
    : data.overall_status === "degraded_performance"
      ? "Some components are experiencing issues."
      : "We are experiencing some issues."

  const affectedComponentIds = data.active_incidents.flatMap(incident => 
    incident.affected_components
  )

  return {
    allOperational: data.overall_status === "operational",
    severity,
    summary,
    affectedComponentIds,
    lastUpdated: data.last_updated,
    components,
    name: data.name,
    description: data.description,
    logo_url: data.logo_url,
    primary_color: data.primary_color,
    support_email: data.support_email,
    support_url: data.support_url
  }
}

export function transformBackendIncidents(data: BackendStatusPageResponse): IncidentsPayload {
  const transformIncident = (incident: BackendIncident): Incident => ({
    id: incident.id,
    title: incident.title,
    state: incident.status,
    startedAt: incident.started_at,
    resolvedAt: incident.resolved_at,
    severity: incident.impact === "critical" ? "major" : incident.impact === "major" ? "major" : "minor",
    affectedComponentIds: incident.affected_components,
    updates: [] // You may want to fetch incident updates from a separate endpoint
  })

  return {
    active: data.active_incidents.map(transformIncident),
    resolved: data.recent_incidents.filter(i => i.status === "resolved").map(transformIncident)
  }
}
