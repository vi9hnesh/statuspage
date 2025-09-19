import { Badge } from "@/components/ui/badge"

type ComponentStatus = "operational" | "degraded" | "outage" | "maintenance"

export function ComponentsList({
  components,
}: {
  components: Array<{ id: string; name: string; status: ComponentStatus; description?: string }>
}) {
  if (!components || components.length === 0) {
    return <p className="p-3 text-sm">No components available.</p>
  }

  return (
    <div className="flex flex-col divide-y">
      {components.map((c) => (
        <div key={c.id} className="flex items-start justify-between gap-3 p-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span aria-hidden className={dotClass(c.status)} />
              <p className="truncate text-sm font-medium">{c.name}</p>
              <span className="sr-only">Status: {badgeVisual(c.status).label}</span>
            </div>
            {c.description ? <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{c.description}</p> : null}
          </div>
          <StatusBadge status={c.status} />
        </div>
      ))}
    </div>
  )
}

function StatusBadge({ status }: { status: ComponentStatus }) {
  const { label, className } = badgeVisual(status)
  return <Badge className={className}>{label}</Badge>
}

function badgeVisual(status: ComponentStatus) {
  switch (status) {
    case "operational":
      return {
        label: "Operational",
        className: "border border-emerald-200 bg-emerald-50 text-emerald-900 hover:bg-emerald-50",
      }
    case "degraded":
      return { label: "Degraded", className: "border border-amber-200 bg-amber-50 text-amber-900 hover:bg-amber-50" }
    case "maintenance":
      return { label: "Maintenance", className: "border border-amber-200 bg-amber-50 text-amber-900 hover:bg-amber-50" }
    case "outage":
      return { label: "Outage", className: "border border-red-200 bg-red-50 text-red-900 hover:bg-red-50" }
  }
}

function dotClass(status: ComponentStatus) {
  const base = "inline-block h-2.5 w-2.5 rounded-full"
  switch (status) {
    case "operational":
      return `${base} bg-emerald-500`
    case "degraded":
      return `${base} bg-amber-500`
    case "maintenance":
      return `${base} bg-amber-500`
    case "outage":
      return `${base} bg-red-600`
  }
}
