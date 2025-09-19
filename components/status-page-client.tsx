"use client"

import useSWR from "swr"
import { StatusBanner } from "./status-banner"
import { ComponentsListEnhanced } from "./status/components-list-enhanced"
import { IncidentFeed } from "./incident-feed"
import { Card } from "@/components/ui/card"

type ComponentStatus = "operational" | "degraded" | "outage" | "maintenance"
type IncidentLifecycle = "investigating" | "identified" | "monitoring" | "resolved"

type StatusResponse = {
  overallStatus: "operational" | "degraded" | "partial_outage" | "outage" | "maintenance"
  summary: string
  components: Array<{
    id: string
    name: string
    status: ComponentStatus
    description?: string
  }>
  lastUpdatedISO: string
}

type Incident = {
  id: string
  title: string
  status: IncidentLifecycle
  updates: Array<{ at: string; text: string }>
  affectedComponents: string[]
  startedAt: string
  resolvedAt?: string
  severity: "minor" | "major"
}

type IncidentsResponse = {
  active: Incident[]
  resolved: Incident[]
}

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export default function StatusPageClient() {
  const { data: statusData } = useSWR<StatusResponse>("/api/status", fetcher, {
    refreshInterval: 60_000,
  })
  const { data: incidentsData } = useSWR<IncidentsResponse>("/api/incidents", fetcher, {
    refreshInterval: 60_000,
  })

  const activeIncidents = incidentsData?.active ?? []
  const bannerSeverity =
    activeIncidents.length === 0 ? "ok" : activeIncidents.some((i) => i.severity === "major") ? "major" : "minor"

  const bannerMessage =
    activeIncidents.length === 0
      ? "All systems operational"
      : `${activeIncidents.length} active incident${activeIncidents.length > 1 ? "s" : ""}${
          statusData?.summary ? ` • ${statusData.summary}` : ""
        }`

  return (
    <div className="mx-auto w-full max-w-5xl p-4 md:p-8">
      {/* Slim brand header */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="inline-block size-5 rounded-md bg-foreground/90" aria-hidden />
          <span className="text-sm font-semibold">Acme Status</span>
        </div>
        <nav aria-label="Status navigation" className="hidden gap-4 text-sm text-muted-foreground md:flex">
          <a href="#active-incidents" className="hover:text-foreground">
            Incidents
          </a>
          <a href="#components" className="hover:text-foreground">
            Components
          </a>
          <a href="#resolved" className="hover:text-foreground">
            Resolved
          </a>
        </nav>
      </div>

      {/* Overall status banner */}
      <header className="mb-6 md:mb-8">
        <StatusBanner severity={bannerSeverity} message={bannerMessage} lastUpdatedISO={statusData?.lastUpdatedISO} />
      </header>

      {/* 1) Active Incidents */}
      <section id="active-incidents" aria-labelledby="active-incidents-heading" className="mb-6 md:mb-8">
        <h2 id="active-incidents-heading" className="mb-3 text-lg font-semibold text-balance">
          Active Incidents
        </h2>
        <IncidentFeed
          // Only render the "active" card
          active={incidentsData?.active ?? []}
          resolved={[]}
          mode="active"
        />
      </section>

      {/* 2) Components */}
      <section id="components" aria-labelledby="components-heading" className="mb-6 md:mb-8">
        <h2 id="components-heading" className="mb-3 text-lg font-semibold text-balance">
          Components
        </h2>
        <ComponentsListEnhanced />
      </section>

      {/* 3) Resolved Incidents */}
      <section id="resolved" aria-labelledby="resolved-incidents-heading" className="mb-6 md:mb-8">
        <h2 id="resolved-incidents-heading" className="mb-3 text-lg font-semibold text-balance">
          Resolved Incidents
        </h2>
        <IncidentFeed
          // Only render the "resolved" accordion
          active={[]}
          resolved={incidentsData?.resolved ?? []}
          mode="resolved"
        />
      </section>
    </div>
  )
}
