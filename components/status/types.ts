export type ComponentStatus = "operational" | "degraded" | "outage" | "maintenance"
export type IncidentState = "investigating" | "identified" | "monitoring" | "resolved"
export type Severity = "none" | "minor" | "major"

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
