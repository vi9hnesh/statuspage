"use client"
import type { Incident } from "./types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Clock, CheckCircle2, AlertCircle } from "lucide-react"

function stateBadge(state: Incident["state"]) {
  switch (state) {
    case "investigating":
      return (
        <Badge variant="secondary" className="bg-amber-100 text-amber-900 border-amber-200">
          Investigating
        </Badge>
      )
    case "identified":
      return (
        <Badge variant="secondary" className="bg-amber-100 text-amber-900 border-amber-200">
          Identified
        </Badge>
      )
    case "monitoring":
      return (
        <Badge variant="secondary" className="bg-emerald-100 text-emerald-900 border-emerald-200">
          Monitoring
        </Badge>
      )
    default:
      return (
        <Badge variant="secondary" className="bg-emerald-100 text-emerald-900 border-emerald-200">
          Resolved
        </Badge>
      )
  }
}

function LastUpdate({ updates }: { updates: Incident["updates"] }) {
  const last = updates[updates.length - 1]
  if (!last) return null
  return (
    <div className="flex items-center gap-1 text-xs text-muted-foreground">
      <Clock className="size-3" aria-hidden /> {new Date(last.ts).toUTCString()}
    </div>
  )
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
    <div className="space-y-4">
      {showActive && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <AlertCircle className="size-4 text-amber-600" aria-hidden />
              Active incidents
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {active.length === 0 ? (
              <p className="text-sm text-muted-foreground flex items-center gap-2">
                <CheckCircle2 className="size-4 text-emerald-600" aria-hidden />
                No active incidents.
              </p>
            ) : (
              active.map((inc) => (
                <div key={inc.id} className="rounded-md border p-3">
                  <div className="flex items-center justify-between gap-2">
                    <div className="font-medium">{inc.title}</div>
                    {stateBadge(inc.state)}
                  </div>
                  <div className="mt-2 text-sm text-muted-foreground">
                    Affected: {inc.affectedComponentIds.join(", ")}
                  </div>
                  <div className="mt-2">
                    <LastUpdate updates={inc.updates} />
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      )}

      {showResolved && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Resolved incidents</CardTitle>
          </CardHeader>
          <CardContent>
            {resolved.length === 0 ? (
              <p className="text-sm text-muted-foreground">No resolved incidents in the past 90 days.</p>
            ) : (
              <Accordion type="multiple" className="w-full">
                {resolved.map((inc) => (
                  <AccordionItem key={inc.id} value={inc.id}>
                    <AccordionTrigger className="text-left">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between w-full gap-2">
                        <span className="font-medium">{inc.title}</span>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <span>Started {new Date(inc.startedAt).toUTCString()}</span>
                          {inc.resolvedAt && <span>Resolved {new Date(inc.resolvedAt).toUTCString()}</span>}
                          {stateBadge("resolved")}
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-3">
                        {inc.updates.map((u, idx) => (
                          <div key={idx} className="rounded-md border p-3">
                            <div className="text-xs text-muted-foreground">{new Date(u.ts).toUTCString()}</div>
                            <p className="mt-1 text-sm">{u.body}</p>
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
