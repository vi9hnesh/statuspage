import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"

type IncidentLifecycle = "investigating" | "identified" | "monitoring" | "resolved"

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

export function IncidentFeed({
  active,
  resolved,
  mode = "all",
}: {
  active: Incident[]
  resolved: Incident[]
  mode?: "all" | "active" | "resolved"
}) {
  const showActive = mode === "all" || mode === "active"
  const showResolved = mode === "all" || mode === "resolved"

  return (
    <div className="space-y-6">
      {showActive && (
        <Card className="p-3 sm:p-4">
          <h3 className="mb-3 text-sm font-medium">Active Incidents</h3>
          {active.length === 0 ? (
            <p className="text-sm text-muted-foreground">No active incidents.</p>
          ) : (
            <ul className="space-y-3">
              {active.map((i) => (
                <li key={i.id} className="rounded-md border p-3">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-medium">{i.title}</p>
                        <IncidentStatusBadge status={i.status} />
                        <SeverityBadge severity={i.severity} />
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">
                        Affected: {i.affectedComponents.length > 0 ? i.affectedComponents.join(", ") : "—"}
                      </p>
                    </div>
                    <p className="text-xs text-muted-foreground">Last update: {formatISO(latestUpdateISO(i))} UTC</p>
                  </div>
                  <ul className="mt-3 space-y-2">
                    {i.updates.slice(0, 2).map((u, idx) => (
                      <li key={idx} className="text-sm">
                        <span className="mr-2 text-xs opacity-70">{formatISO(u.at)} UTC</span>
                        {u.text}
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          )}
        </Card>
      )}

      {showResolved && (
        <Card className="p-3 sm:p-4">
          <h3 className="mb-3 text-sm font-medium">Resolved Incidents</h3>
          {resolved.length === 0 ? (
            <p className="text-sm text-muted-foreground">No resolved incidents.</p>
          ) : (
            <Accordion type="multiple" className="w-full">
              {resolved.map((i) => (
                <AccordionItem key={i.id} value={i.id}>
                  <AccordionTrigger>
                    <div className="flex flex-col items-start gap-1 text-left sm:flex-row sm:items-center sm:gap-3">
                      <span className="font-medium">{i.title}</span>
                      <IncidentStatusBadge status="resolved" />
                      <span className="text-xs text-muted-foreground">
                        Resolved: {i.resolvedAt ? `${formatISO(i.resolvedAt)} UTC` : "—"}
                      </span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="rounded-md border p-3">
                      <p className="mb-2 text-xs text-muted-foreground">
                        Affected: {i.affectedComponents.length > 0 ? i.affectedComponents.join(", ") : "—"}
                      </p>
                      <ul className="space-y-2">
                        {i.updates.map((u, idx) => (
                          <li key={idx} className="text-sm">
                            <span className="mr-2 text-xs opacity-70">{formatISO(u.at)} UTC</span>
                            {u.text}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </Card>
      )}
    </div>
  )
}

function IncidentStatusBadge({ status }: { status: IncidentLifecycle }) {
  switch (status) {
    case "investigating":
      return (
        <Badge className="border border-amber-200 bg-amber-50 text-amber-900 hover:bg-amber-50">Investigating</Badge>
      )
    case "identified":
      return <Badge className="border border-amber-200 bg-amber-50 text-amber-900 hover:bg-amber-50">Identified</Badge>
    case "monitoring":
      return (
        <Badge className="border border-emerald-200 bg-emerald-50 text-emerald-900 hover:bg-emerald-50">
          Monitoring
        </Badge>
      )
    case "resolved":
      return (
        <Badge className="border border-emerald-200 bg-emerald-50 text-emerald-900 hover:bg-emerald-50">Resolved</Badge>
      )
  }
}

function SeverityBadge({ severity }: { severity: "minor" | "major" }) {
  return severity === "major" ? (
    <Badge className="border border-red-200 bg-red-50 text-red-900 hover:bg-red-50">Major</Badge>
  ) : (
    <Badge className="border border-amber-200 bg-amber-50 text-amber-900 hover:bg-amber-50">Minor</Badge>
  )
}

function latestUpdateISO(i: Incident) {
  return i.updates.reduce((latest, u) => (u.at > latest ? u.at : latest), i.startedAt)
}

function formatISO(iso: string) {
  return new Date(iso).toLocaleString("en-US", { timeZone: "UTC", hour12: false })
}
