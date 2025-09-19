import { CheckCircle2, AlertTriangle, XCircle } from "lucide-react"
import { cn } from "@/lib/utils"

type Severity = "ok" | "minor" | "major"

export function StatusBanner({
  severity,
  message,
  lastUpdatedISO,
}: {
  severity: Severity
  message: string
  lastUpdatedISO?: string
}) {
  const styles =
    severity === "ok"
      ? {
          container: "bg-emerald-50 text-emerald-900 border border-emerald-200",
          icon: <CheckCircle2 className="h-5 w-5 text-emerald-600" aria-hidden="true" />,
          label: "All systems operational",
        }
      : severity === "minor"
        ? {
            container: "bg-amber-50 text-amber-900 border border-amber-200",
            icon: <AlertTriangle className="h-5 w-5 text-amber-600" aria-hidden="true" />,
            label: "Active incident",
          }
        : {
            container: "bg-red-50 text-red-900 border border-red-200",
            icon: <XCircle className="h-5 w-5 text-red-600" aria-hidden="true" />,
            label: "Major incident",
          }

  return (
    <div role="status" aria-live="polite" className={cn("w-full rounded-lg p-4 md:p-5", styles.container)}>
      <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          {styles.icon}
          <p className="font-medium">{message || styles.label}</p>
        </div>
        {lastUpdatedISO ? (
          <p className="text-xs opacity-80">
            Last updated: {new Date(lastUpdatedISO).toLocaleString("en-US", { timeZone: "UTC", hour12: false })} UTC
          </p>
        ) : null}
      </div>
    </div>
  )
}
