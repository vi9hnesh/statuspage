"use client"

import { useStatusPageData } from "./status-page-provider"
import type { StatusSummary } from "./types"
import { CheckCircle2, AlertTriangle, OctagonAlert } from "lucide-react"

function bannerStyles(severity: StatusSummary["severity"]) {
  // Color system: neutrals + emerald (primary), amber (degraded/maintenance), red (outage)
  if (severity === "none") {
    return "bg-emerald-50 text-emerald-900 border-emerald-200"
  }
  if (severity === "major") {
    return "bg-red-50 text-red-900 border-red-200"
  }
  return "bg-amber-50 text-amber-900 border-amber-200"
}

function BannerIcon({ severity }: { severity: StatusSummary["severity"] }) {
  if (severity === "none") return <CheckCircle2 className="size-5 text-emerald-600" aria-hidden />
  if (severity === "major") return <OctagonAlert className="size-5 text-red-600" aria-hidden />
  return <AlertTriangle className="size-5 text-amber-600" aria-hidden />
}

interface StatusBannerProps {
  slug: string
}

export function StatusBanner({ slug }: StatusBannerProps) {
  const { statusData } = useStatusPageData()
  const severity = statusData.severity

  return (
    <div className={`border-b ${bannerStyles(severity)}`}>
      <div className="mx-auto max-w-5xl px-4 py-5 md:py-7">
        <div className="flex flex-col items-start gap-2 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-2">
            <BannerIcon severity={severity} />
            <h1 id="overall-status" className="text-pretty text-base md:text-lg font-medium">
              {statusData.summary}
            </h1>
          </div>
          <p className="text-xs md:text-sm opacity-70">
            Last updated {new Date(statusData.lastUpdated).toUTCString()}
          </p>
        </div>
        {!statusData.allOperational && statusData.affectedComponentIds.length > 0 && (
          <p className="mt-2 text-sm">Affected: {statusData.affectedComponentIds.join(", ")}</p>
        )}
      </div>
    </div>
  )
}
