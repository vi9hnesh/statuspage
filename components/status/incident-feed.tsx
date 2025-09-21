"use client"
import type { Incident } from "./types"
import { Badge } from "@/components/ui/badge"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Clock, CheckCircle2, AlertTriangle, OctagonAlert, Info } from "lucide-react"

function StateBadge({ state }: { state: Incident["state"] }) {
  switch (state) {
    case "investigating":
      return (
        <Badge className="border border-amber-200 bg-amber-50 text-amber-900 hover:bg-amber-50">
          Investigating
        </Badge>
      )
    case "identified":
      return (
        <Badge className="border border-amber-200 bg-amber-50 text-amber-900 hover:bg-amber-50">
          Identified
        </Badge>
      )
    case "monitoring":
      return (
        <Badge className="border border-emerald-200 bg-emerald-50 text-emerald-900 hover:bg-emerald-50">
          Monitoring
        </Badge>
      )
    default:
      return (
        <Badge className="border border-emerald-200 bg-emerald-50 text-emerald-900 hover:bg-emerald-50">
          Resolved
        </Badge>
      )
  }
}

function SeverityBadge({ severity }: { severity: Incident["severity"] }) {
  switch (severity) {
    case "major":
      return (
        <Badge className="border border-red-200 bg-red-50 text-red-900 hover:bg-red-50">
          Major
        </Badge>
      )
    case "minor":
      return (
        <Badge className="border border-amber-200 bg-amber-50 text-amber-900 hover:bg-amber-50">
          Minor
        </Badge>
      )
    case "maintenance":
      return (
        <Badge className="border border-blue-200 bg-blue-50 text-blue-900 hover:bg-blue-50">
          Maintenance
        </Badge>
      )
    default:
      return (
        <Badge className="border border-slate-200 bg-slate-50 text-slate-900 hover:bg-slate-50">
          {severity}
        </Badge>
      )
  }
}

function StateIcon({ state }: { state: Incident["state"] }) {
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

function LastUpdate({ updates }: { updates: Incident["updates"] }) {
  const last = updates[updates.length - 1]
  if (!last) return null
  return (
    <div className="flex items-center gap-1 text-xs text-slate-500">
      <Clock className="size-3" aria-hidden /> 
      {new Date(last.ts).toLocaleDateString("en-US", { 
        timeZone: "UTC", 
        month: "short", 
        day: "numeric", 
        hour: "2-digit", 
        minute: "2-digit",
        hour12: false 
      })} UTC
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
                {active.map((inc) => (
                  <div key={inc.id} className="rounded-md border border-slate-200 dark:border-slate-700 p-3 sm:p-4">
                    <div className="flex flex-col gap-3">
                      <div className="flex flex-col gap-2">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                          <div className="flex items-center gap-2 min-w-0 flex-1">
                            <StateIcon state={inc.state} />
                            <h3 className="font-medium text-slate-900 dark:text-slate-100 truncate">{inc.title}</h3>
                          </div>
                          <div className="flex flex-wrap gap-1.5 sm:gap-2">
                            <StateBadge state={inc.state} />
                            <SeverityBadge severity={inc.severity} />
                          </div>
                        </div>
                        <div className="text-sm text-slate-500 break-words">
                          <span className="font-medium">Affected:</span> {inc.affectedComponentIds.length > 0 ? inc.affectedComponentIds.join(", ") : "—"}
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="flex-shrink-0">
                          <LastUpdate updates={inc.updates} />
                        </div>
                      </div>
                    </div>
                    {inc.updates.length > 0 && (
                      <div className="mt-3 sm:mt-4 pt-3 border-t border-slate-100 dark:border-slate-700">
                        <div className="space-y-2 sm:space-y-3">
                          {inc.updates.slice(-2).map((u, idx) => (
                            <div key={idx} className="text-sm">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-xs text-slate-400 font-medium">
                                  {new Date(u.ts).toLocaleDateString("en-US", { 
                                    timeZone: "UTC", 
                                    month: "short", 
                                    day: "numeric", 
                                    hour: "2-digit", 
                                    minute: "2-digit",
                                    hour12: false 
                                  })} UTC
                                </span>
                              </div>
                              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{u.body}</p>
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
              <p className="text-sm text-slate-500">No resolved incidents in the past 90 days.</p>
            ) : (
              <Accordion type="multiple" className="w-full space-y-2">
                {resolved.map((inc) => (
                  <AccordionItem key={inc.id} value={inc.id} className="border border-slate-200 dark:border-slate-700 rounded-md">
                    <AccordionTrigger className="text-left px-3 py-3 sm:px-4 hover:no-underline hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-md">
                      <div className="flex flex-col gap-2 w-full">
                        <div className="flex items-center gap-2 min-w-0">
                          <CheckCircle2 className="size-4 text-emerald-600 flex-shrink-0" />
                          <span className="font-medium text-slate-900 dark:text-slate-100 truncate">{inc.title}</span>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-xs text-slate-500">
                          <div className="flex flex-wrap gap-2">
                            <span>Started {new Date(inc.startedAt).toLocaleDateString("en-US", { 
                              timeZone: "UTC", 
                              month: "short", 
                              day: "numeric", 
                              hour: "2-digit", 
                              minute: "2-digit",
                              hour12: false 
                            })} UTC</span>
                            {inc.resolvedAt && (
                              <span>Resolved {new Date(inc.resolvedAt).toLocaleDateString("en-US", { 
                                timeZone: "UTC", 
                                month: "short", 
                                day: "numeric", 
                                hour: "2-digit", 
                                minute: "2-digit",
                                hour12: false 
                              })} UTC</span>
                            )}
                          </div>
                          <div className="flex-shrink-0">
                            <StateBadge state="resolved" />
                          </div>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-3 pb-3 sm:px-4">
                      <div className="pt-3 border-t border-slate-100 dark:border-slate-700">
                        <p className="mb-3 text-sm text-slate-500 break-words">
                          <span className="font-medium">Affected:</span> {inc.affectedComponentIds?.length > 0 ? inc.affectedComponentIds.join(", ") : "—"}
                        </p>
                        <div className="space-y-2 sm:space-y-3">
                          {inc.updates?.map((u, idx) => (
                            <div key={idx} className="rounded-md border border-slate-100 dark:border-slate-700 p-3">
                              <div className="text-xs text-slate-400 font-medium mb-1">
                                {new Date(u.ts).toLocaleDateString("en-US", { 
                                  timeZone: "UTC", 
                                  month: "short", 
                                  day: "numeric", 
                                  hour: "2-digit", 
                                  minute: "2-digit",
                                  hour12: false 
                                })} UTC
                              </div>
                              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{u.body}</p>
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
