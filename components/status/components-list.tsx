"use client"

import useSWR from "swr"
import { jsonFetcher } from "@/lib/fetcher"
import type { StatusSummary, StatusComponent } from "./types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Activity, Cloud, Database, Monitor, Server, Webhook } from "lucide-react"

function statusBadge(status: StatusComponent["status"]) {
  switch (status) {
    case "operational":
      return (
        <Badge variant="secondary" className="bg-emerald-100 text-emerald-900 border-emerald-200">
          Operational
        </Badge>
      )
    case "degraded":
      return (
        <Badge variant="secondary" className="bg-amber-100 text-amber-900 border-amber-200">
          Degraded
        </Badge>
      )
    case "maintenance":
      return (
        <Badge variant="secondary" className="bg-amber-100 text-amber-900 border-amber-200">
          Maintenance
        </Badge>
      )
    default:
      return (
        <Badge variant="secondary" className="bg-red-100 text-red-900 border-red-200">
          Outage
        </Badge>
      )
  }
}

function pickIcon(name: string) {
  const className = "size-4 text-muted-foreground"
  if (/api/i.test(name)) return <Activity className={className} aria-hidden />
  if (/dashboard/i.test(name)) return <Monitor className={className} aria-hidden />
  if (/db|database/i.test(name)) return <Database className={className} aria-hidden />
  if (/webhook/i.test(name)) return <Webhook className={className} aria-hidden />
  if (/cdn|storage|cloud/i.test(name)) return <Cloud className={className} aria-hidden />
  return <Server className={className} aria-hidden />
}

// Deterministic helper so cell placement is stable across renders (prevents hydration issues)
function seededIndices(seed: string, total: number, k: number) {
  // Simple string hash then LCG
  let h = 2166136261
  for (let i = 0; i < seed.length; i++) h = (h ^ seed.charCodeAt(i)) * 16777619
  const res: number[] = []
  let x = (h >>> 0) % 2147483647 || 1
  const used = new Set<number>()
  while (res.length < Math.min(k, total)) {
    x = (x * 48271) % 2147483647
    const idx = x % total
    if (!used.has(idx)) {
      used.add(idx)
      res.push(idx)
    }
  }
  return res.sort((a, b) => a - b)
}

function UptimeCells({
  id,
  status,
  value = 100,
  cells = 90,
}: {
  id: string
  status: StatusComponent["status"]
  value?: number
  cells?: number
}) {
  // how many cells are considered "up"
  const upCount = Math.round((Math.max(0, Math.min(100, value)) / 100) * cells)

  // derive a few highlighted cells to represent incidents/degradations
  // red for outage, amber for degraded/maintenance. Deterministic by id.
  const incidentBase = Math.max(1, Math.round(cells - upCount || (status === "operational" ? 0 : cells * 0.02)))
  const incidentCount =
    status === "outage"
      ? Math.max(incidentBase, 3)
      : status === "degraded" || status === "maintenance"
        ? Math.max(incidentBase, 2)
        : 0
  const incidentIdx = incidentCount > 0 ? seededIndices(id, cells, incidentCount) : []

  return (
    <div
      className="hidden md:flex items-center gap-0.5"
      role="img"
      aria-label={`Uptime last 90 days ${value.toFixed(3)}%`}
    >
      {Array.from({ length: cells }).map((_, i) => {
        // choose color per cell
        let cls = "bg-muted"
        if (i < upCount) cls = "bg-emerald-500"
        if (incidentIdx.includes(i)) {
          cls = status === "outage" ? "bg-red-500" : "bg-amber-400"
        }
        return <span key={i} className={`w-1 h-3 rounded-sm ${cls}`} aria-hidden />
      })}
    </div>
  )
}

export function ComponentsList() {
  const { data } = useSWR<StatusSummary>("/api/status", jsonFetcher, { refreshInterval: 60_000 })
  const groups = (data?.components ?? []).reduce<Record<string, StatusComponent[]>>((acc, c) => {
    const key = c.group ?? "Core"
    acc[key] = acc[key] ?? []
    acc[key].push(c)
    return acc
  }, {})

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-pretty">Components</h2>

      {Object.entries(groups).map(([group, items]) => (
        <Card key={group} className="overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">{group}</CardTitle>
            {(() => {
              const hasOutage = items.some((i) => i.status === "outage")
              const hasDegraded = items.some((i) => i.status === "degraded" || i.status === "maintenance")
              const label = hasOutage ? "Issues" : hasDegraded ? "Degraded" : "Operational"
              const cls = hasOutage
                ? "bg-red-100 text-red-900 border-red-200"
                : hasDegraded
                  ? "bg-amber-100 text-amber-900 border-amber-200"
                  : "bg-emerald-100 text-emerald-900 border-emerald-200"
              return (
                <Badge variant="secondary" className={cls}>
                  {label}
                </Badge>
              )
            })()}
          </CardHeader>
          <CardContent className="divide-y">
            {items.map((c) => (
              <div key={c.id} className="flex items-center justify-between py-3">
                <div className="flex items-center gap-3 min-w-0">
                  {pickIcon(c.name)}
                  <div className="min-w-0">
                    <div className="font-medium leading-6 truncate">{c.name}</div>
                    <div className="text-xs text-muted-foreground leading-5">
                      <span className="sr-only">Uptime:</span>
                      <UptimeCells id={c.id} status={c.status} value={c.uptime90d ?? 100} />
                    </div>
                  </div>
                </div>
                {statusBadge(c.status)}
              </div>
            ))}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
