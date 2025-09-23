"use client"

import type { ComponentStatus } from "./types"

type UptimeCellsProps = {
  history?: ComponentStatus[]
  fallbackStatus: ComponentStatus
  cells?: number // default 90
}

const colorFor = (s: ComponentStatus) => {
  switch (s) {
    case "operational":
      return "bg-emerald-500"
    case "degraded_performance":
    case "maintenance":
      return "bg-amber-500"
    case "partial_outage":
    case "major_outage":
      return "bg-red-500"
    default:
      return "bg-zinc-300"
  }
}

// Deterministic pseudo-random to avoid hydration mismatch for fallback generation
function hash(str: string) {
  let h = 2166136261
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i)
    h += (h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24)
  }
  return h >>> 0
}

export function generateFallbackHistory(id: string, fallbackStatus: ComponentStatus, n: number): ComponentStatus[] {
  const arr: ComponentStatus[] = Array(n).fill("operational")
  const seed = hash(id)
  // sprinkle a few amber/red cells depending on status
  const blips =
    fallbackStatus === "major_outage" || fallbackStatus === "partial_outage" ? 6 : 
    fallbackStatus === "degraded_performance" || fallbackStatus === "maintenance" ? 4 : 2
  for (let i = 0; i < blips; i++) {
    const idx = (seed + i * 13) % n
    arr[idx] = fallbackStatus === "major_outage" || fallbackStatus === "partial_outage" ? "partial_outage" : "degraded_performance"
  }
  return arr
}

export default function UptimeCells({ history, fallbackStatus, cells = 90 }: UptimeCellsProps) {
  const values =
    history && history.length > 0
      ? history.slice(-cells)
      : generateFallbackHistory(fallbackStatus, fallbackStatus, cells)

  return (
    <div className="hidden md:flex items-center gap-1 overflow-hidden" aria-hidden="true">
      {values.map((s, i) => (
        <span key={i} className={`h-3 w-1.5 rounded-sm ${colorFor(s)}`} />
      ))}
    </div>
  )
}
