"use client"

import { useStatusPageData } from "./status-page-provider"
import type { StatusSummary } from "./types"
import { CheckCircle2, AlertTriangle, OctagonAlert } from "lucide-react"

function bannerStyles(severity: StatusSummary["severity"]) {
  // Updated to match status components design with slate colors and proper contrast
  if (severity === "none") {
    return "bg-emerald-50 dark:bg-emerald-950/20 text-emerald-900 dark:text-emerald-100 border-emerald-200 dark:border-emerald-800"
  }
  if (severity === "major") {
    return "bg-red-50 dark:bg-red-950/20 text-red-900 dark:text-red-100 border-red-200 dark:border-red-800"
  }
  return "bg-amber-50 dark:bg-amber-950/20 text-amber-900 dark:text-amber-100 border-amber-200 dark:border-amber-800"
}

function BannerIcon({ severity }: { severity: StatusSummary["severity"] }) {
  if (severity === "none") return <CheckCircle2 className="size-5 text-emerald-600 dark:text-emerald-400" aria-hidden />
  if (severity === "major") return <OctagonAlert className="size-5 text-red-600 dark:text-red-400" aria-hidden />
  return <AlertTriangle className="size-5 text-amber-600 dark:text-amber-400" aria-hidden />
}

interface StatusBannerProps {
  slug: string
}

export function StatusBanner({ slug }: StatusBannerProps) {
  const { statusData } = useStatusPageData()
  const severity = statusData.severity

  return (
    <div className="mx-auto max-w-5xl px-3 sm:px-4">
      <div className={`rounded-[7px] border p-4 sm:p-6 ${bannerStyles(severity)}`}>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3">
          <BannerIcon severity={severity} />
          <h2 id="overall-status" className="text-base sm:text-lg md:text-xl font-semibold text-center sm:text-left">
            {statusData.summary}
          </h2>
        </div>
        {!statusData.allOperational && statusData.affectedComponentIds.length > 0 && (
          <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-current/20 text-center">
            <p className="text-sm break-words">
              <span className="font-medium">Affected services:</span> {statusData.affectedComponentIds.join(", ")}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
