import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, AlertTriangle, OctagonAlert, Info, Clock } from "lucide-react"

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

function StateIcon({ state }: { state: IncidentLifecycle }) {
  switch (state) {
    case "investigating":
      return <AlertTriangle className="size-4 text-amber-600" />
    case "identified":
      return <Info className="size-4 text-amber-600" />
    case "monitoring":
      return <CheckCircle2 className="size-4 text-emerald-600" />
    default:
      return <CheckCircle2 className="size-4 text-emerald-600" />
  }
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
    <div className="space-y-6 sm:space-y-8">
      {showActive && (
        <div className="relative rounded-[7px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <div className="rounded-t-[7px] px-3 py-3 sm:px-4 sm:py-3.5 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <OctagonAlert className="size-4 text-amber-600 flex-shrink-0" aria-hidden />
              <h2 className="text-sm sm:text-base font-medium text-slate-900 dark:text-slate-50">Active incidents</h2>
            </div>
          </div>
          <div className="p-3 sm:p-4">
            {active.length === 0 ? (
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <CheckCircle2 className="size-4 text-emerald-600 flex-shrink-0" aria-hidden />
                <span>No active incidents.</span>
              </div>
            ) : (
              <div className="space-y-3 sm:space-y-4">
                {active.map((i) => (
                  <div key={i.id} className="rounded-md border border-slate-200 dark:border-slate-700 p-3 sm:p-4">
                    <div className="flex flex-col gap-3">
                      <div className="flex flex-col gap-2">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                          <div className="flex items-center gap-2 min-w-0 flex-1">
                            <StateIcon state={i.status} />
                            <h3 className="font-medium text-slate-900 dark:text-slate-100 truncate">{i.title}</h3>
                          </div>
                          <div className="flex flex-wrap gap-1.5 sm:gap-2">
                            <IncidentStatusBadge status={i.status} />
                            <SeverityBadge severity={i.severity} />
                          </div>
                        </div>
                        <div className="text-sm text-slate-500 break-words">
                          <span className="font-medium">Affected:</span> {i.affectedComponents.length > 0 ? i.affectedComponents.join(", ") : "—"}
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="flex-shrink-0">
                          <div className="flex items-center gap-1 text-xs text-slate-500">
                            <Clock className="size-3 flex-shrink-0" aria-hidden />
                            {formatISO(latestUpdateISO(i))} UTC
                          </div>
                        </div>
                      </div>
                    </div>
                    {i.updates.length > 0 && (
                      <div className="mt-3 sm:mt-4 pt-3 border-t border-slate-100 dark:border-slate-700">
                        <div className="space-y-2 sm:space-y-3">
                          {i.updates.slice(-2).map((u, idx) => (
                            <div key={idx} className="text-sm">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-xs text-slate-400 font-medium">
                                  {formatISO(u.at)} UTC
                                </span>
                              </div>
                              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{u.text}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {showResolved && (
        <div className="relative rounded-[7px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <div className="rounded-t-[7px] px-3 py-3 sm:px-4 sm:py-3.5 border-b border-slate-100 dark:border-slate-800">
            <h2 className="text-sm sm:text-base font-medium text-slate-900 dark:text-slate-50">Resolved incidents</h2>
          </div>
          <div className="p-3 sm:p-4">
            {resolved.length === 0 ? (
              <p className="text-sm text-slate-500">No resolved incidents.</p>
            ) : (
              <Accordion type="multiple" className="w-full space-y-2">
                {resolved.map((i) => (
                  <AccordionItem key={i.id} value={i.id} className="border border-slate-200 dark:border-slate-700 rounded-md">
                    <AccordionTrigger className="text-left px-3 py-3 sm:px-4 hover:no-underline hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-md">
                      <div className="flex flex-col gap-2 w-full">
                        <div className="flex items-center gap-2 min-w-0">
                          <CheckCircle2 className="size-4 text-emerald-600 flex-shrink-0" />
                          <span className="font-medium text-slate-900 dark:text-slate-100 truncate">{i.title}</span>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-xs text-slate-500">
                          <div className="flex flex-wrap gap-2">
                            <span>Started {formatISO(i.startedAt)} UTC</span>
                            {i.resolvedAt && <span>Resolved {formatISO(i.resolvedAt)} UTC</span>}
                          </div>
                          <div className="flex-shrink-0">
                            <IncidentStatusBadge status="resolved" />
                          </div>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-3 pb-3 sm:px-4">
                      <div className="pt-3 border-t border-slate-100 dark:border-slate-700">
                        <p className="mb-3 text-sm text-slate-500 break-words">
                          <span className="font-medium">Affected:</span> {i.affectedComponents?.length > 0 ? i.affectedComponents.join(", ") : "—"}
                        </p>
                        <div className="space-y-2 sm:space-y-3">
                          {i.updates?.map((u, idx) => (
                            <div key={idx} className="rounded-md border border-slate-100 dark:border-slate-700 p-3">
                              <div className="text-xs text-slate-400 font-medium mb-1">
                                {formatISO(u.at)} UTC
                              </div>
                              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{u.text}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            )}
          </div>
        </div>
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
  return new Date(iso).toLocaleDateString("en-US", { 
    timeZone: "UTC", 
    month: "short", 
    day: "numeric", 
    hour: "2-digit", 
    minute: "2-digit",
    hour12: false 
  })
}
