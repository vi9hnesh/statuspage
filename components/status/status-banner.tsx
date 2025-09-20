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
    <div className="mx-auto max-w-5xl px-4">
      <div className={`rounded-lg border p-4 md:p-6 ${bannerStyles(severity)}`}>
        <div className="flex items-center justify-center gap-3">
          <BannerIcon severity={severity} />
          <h2 id="overall-status" className="text-lg md:text-xl font-semibold">
            {statusData.summary}
          </h2>
        </div>
        {!statusData.allOperational && statusData.affectedComponentIds.length > 0 && (
          <div className="mt-3 pt-3 border-t border-current/20 text-center">
            <p className="text-sm">
              <span className="font-medium">Affected services:</span> {statusData.affectedComponentIds.join(", ")}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
