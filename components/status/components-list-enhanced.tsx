"use client"

import useSWR from "swr"
import { jsonFetcher } from "@/lib/fetcher"
import type { StatusSummary, StatusComponent } from "./types"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  Activity, 
  Cloud, 
  Database, 
  Monitor, 
  Server, 
  Webhook, 
  ChevronLeft, 
  ChevronRight,
  Info
} from "lucide-react"
import { useState } from "react"

function StatusIcon({ status, className = "w-4 h-4" }: { status: StatusComponent["status"], className?: string }) {
  switch (status) {
    case "operational":
      return (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className={`${className} text-emerald-500`}>
          <path d="M8 0C3.589 0 0 3.589 0 8C0 12.411 3.589 16 8 16C12.411 16 16 12.411 16 8C16 3.589 12.411 0 8 0ZM11.947 5.641C10.088 7.023 8.512 8.931 7.264 11.31C7.135 11.557 6.879 11.712 6.6 11.712C6.323 11.715 6.062 11.555 5.933 11.305C5.358 10.188 4.715 9.28 3.968 8.529C3.676 8.236 3.677 7.76 3.971 7.468C4.263 7.176 4.739 7.176 5.032 7.471C5.605 8.047 6.122 8.699 6.595 9.443C7.834 7.398 9.329 5.717 11.053 4.436C11.385 4.19 11.855 4.258 12.102 4.591C12.349 4.923 12.28 5.394 11.947 5.641Z" fill="currentColor"/>
        </svg>
      )
    case "degraded":
      return (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className={`${className} text-amber-500`}>
          <path d="M8 0L0 14h16L8 0zm0 3l5.5 9h-11L8 3zm0 2.5L5 11h6L8 5.5z" fill="currentColor"/>
        </svg>
      )
    case "maintenance":
      return (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className={`${className} text-blue-500`}>
          <path d="M8 0L0 14h16L8 0zm0 3l5.5 9h-11L8 3zm0 2.5L5 11h6L8 5.5z" fill="currentColor"/>
        </svg>
      )
    default:
      return (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className={`${className} text-red-500`}>
          <path d="M8 0C3.589 0 0 3.589 0 8C0 12.411 3.589 16 8 16C12.411 16 16 12.411 16 8C16 3.589 12.411 0 8 0ZM11 9H5V7h6v2z" fill="currentColor"/>
        </svg>
      )
  }
}

// Deterministic helper for stable cell placement
function seededIndices(seed: string, total: number, k: number) {
  let h = 2166136261
  for (let i = 0; i < seed.length; i++) h = (h ^ seed.charCodeAt(i)) * 16777619
  const res: number[] = []
  let x = (h >>> 0) % 2147483647 || 1
  const used = new Set<number>()
  while (res.length < Math.min(k, total)) {
    x = (x * 48271) % 2147483647
    const idx = x % total
    if (!used.has(idx)) {
      used.add(idx)
      res.push(idx)
    }
  }
  return res.sort((a, b) => a - b)
}

function BatteryChart({
  id,
  status,
  value = 100,
  cells = 91, // Approximate number from the example
}: {
  id: string
  status: StatusComponent["status"]
  value?: number
  cells?: number
}) {
  // Fetch historical uptime data for this component
  const { data: uptimeData } = useSWR(
    `/api/uptime?component=${id}&days=${cells}`,
    jsonFetcher,
    { 
      refreshInterval: 300_000, // Refresh every 5 minutes
      revalidateOnFocus: false
    }
  )

  const history = uptimeData?.history || []
  
  // Calculate the spacing between cells to fit cells in 668px width
  const spacing = 668 / cells
  
  return (
    <div className="w-full mt-1">
      <div className="text-slate-500">
        <svg width="100%" height="16" viewBox="0 0 668 16" className="mb-1">
          {Array.from({ length: cells }).map((_, i) => {
            let fillClass = ""
            
            // Use real historical data if available, otherwise fallback to deterministic generation
            if (history.length > 0 && i < history.length) {
              const dayStatus = history[i]?.status || "operational"
              switch (dayStatus) {
                case "operational":
                  fillClass = "fill-emerald-500"
                  break
                case "degraded":
                case "maintenance":
                  fillClass = "fill-amber-400"
                  break
                case "outage":
                  fillClass = "fill-red-500"
                  break
                default:
                  fillClass = "fill-slate-200 dark:fill-slate-700"
              }
            } else {
              // Fallback to deterministic generation
              const upCount = Math.round((Math.max(0, Math.min(100, value)) / 100) * cells)
              const incidentBase = Math.max(1, Math.round(cells - upCount || (status === "operational" ? 0 : cells * 0.02)))
              const incidentCount =
                status === "outage"
                  ? Math.max(incidentBase, 3)
                  : status === "degraded" || status === "maintenance"
                    ? Math.max(incidentBase, 2)
                    : 0
              const incidentIdx = incidentCount > 0 ? seededIndices(id, cells, incidentCount) : []
              
              if (i < upCount && !incidentIdx.includes(i)) {
                fillClass = "fill-emerald-500" // Operational
              } else if (incidentIdx.includes(i)) {
                if (status === "outage") {
                  fillClass = "fill-red-500" // Outage
                } else if (status === "degraded" || status === "maintenance") {
                  fillClass = "fill-amber-400" // Degraded/Maintenance
                } else {
                  fillClass = "fill-emerald-500" // Default operational
                }
              } else {
                fillClass = "fill-slate-200 dark:fill-slate-700" // No data/future
              }
            }

            const x = i * spacing
            return (
              <rect
                key={i}
                x={x.toFixed(2)}
                y="0"
                width="5"
                height="16"
                rx="1"
                ry="1"
                className={`transition-all duration-200 ${fillClass}`}
              />
            )
          })}
        </svg>
      </div>
    </div>
  )
}

function ComponentRow({ 
  component, 
  isExpanded, 
  onToggle,
  subComponents 
}: { 
  component: StatusComponent
  isExpanded?: boolean
  onToggle?: () => void
  subComponents?: StatusComponent[]
}) {
  return (
    <>
      <div className="p-4 md:pt-3 md:pb-3 text-sm">
        <div>
          <div className="h-7 flex flex-grow items-center">
            <div className="mr-2" style={{ opacity: 1, width: "auto" }}>
              <StatusIcon status={component.status} />
            </div>
            <div className="hidden md:flex space-x-2 flex-grow items-center">
              <div className="flex space-x-1.5 items-center">
                <h3 className="font-medium text-slate-900 dark:text-slate-100">{component.name}</h3>
                <div className="transition text-slate-300 hover:text-slate-500 dark:text-slate-500 dark:hover:text-slate-300 mt-[1px] hidden md:block">
                  <Info className="w-4 h-4" />
                </div>
              </div>
              {subComponents && subComponents.length > 0 && (
                <button 
                  onClick={onToggle}
                  className="flex items-center cursor-pointer group transition text-slate-500 hover:text-slate-900 dark:hover:text-slate-200"
                >
                  <span className="hidden md:inline">{subComponents.length} components</span>
                  <span className="flex items-center justify-center w-3 h-6 mt-[2px] ml-1">
                    <svg className={`text-slate-300 dark:text-slate-500 transition group-hover:text-slate-900 dark:group-hover:text-slate-300 ${isExpanded ? 'rotate-180' : ''}`} width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9 0.980774L5.25 5.01924L1.5 0.980774" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </span>
                </button>
              )}
              <div className="flex-grow"></div>
              <div className="ml-2 font-normal flex flex-row items-center gap-1 text-slate-400">
                <div style={{ opacity: 1 }}>
                  <span className="whitespace-nowrap">
                    <var className="not-italic">{(component.uptime90d ?? 100).toFixed(component.uptime90d === 100 ? 0 : 2)}</var>% uptime
                  </span>
                </div>
              </div>
            </div>
            <div className="flex md:hidden items-center min-w-[0px]">
              <h3 className="font-medium">{component.name}</h3>
              {subComponents && subComponents.length > 0 && (
                <button 
                  onClick={onToggle}
                  className="flex items-center cursor-pointer group transition text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 ml-2"
                >
                  <span className="hidden md:inline">{subComponents.length} components</span>
                  <span className="flex items-center justify-center w-3 h-6 mt-[2px] ml-1">
                    <svg className={`text-slate-300 dark:text-slate-500 transition group-hover:text-slate-900 dark:group-hover:text-slate-300 ${isExpanded ? 'rotate-180' : ''}`} width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9 0.980774L5.25 5.01924L1.5 0.980774" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </span>
                </button>
              )}
            </div>
          </div>
          <div className="hidden md:flex">
            <BatteryChart 
              id={component.id} 
              status={component.status} 
              value={component.uptime90d ?? 100} 
            />
          </div>
        </div>
      </div>
      {isExpanded && subComponents && subComponents.map((subComponent) => (
        <div key={subComponent.id} className="pl-8">
          <ComponentRow component={subComponent} />
        </div>
      ))}
    </>
  )
}

export function ComponentsListEnhanced() {
  const { data } = useSWR<StatusSummary>("/api/status", jsonFetcher, { refreshInterval: 60_000 })
  const { data: periodsData } = useSWR("/api/time-periods", jsonFetcher, { refreshInterval: 300_000 })
  const [expandedComponents, setExpandedComponents] = useState<Set<string>>(new Set())
  const [currentPeriodIndex, setCurrentPeriodIndex] = useState(0)
  
  const periods = periodsData?.periods || []
  const currentPeriod = periods[currentPeriodIndex] || { label: "Jun 2025 - Aug 2025" }

  const toggleComponent = (componentId: string) => {
    const newExpanded = new Set(expandedComponents)
    if (newExpanded.has(componentId)) {
      newExpanded.delete(componentId)
    } else {
      newExpanded.add(componentId)
    }
    setExpandedComponents(newExpanded)
  }

  // Use API data directly - it now includes subComponents
  const enhancedComponents = (data?.components ?? []).map((component) => ({
    ...component,
    subComponents: component.subComponents || [],
    isExpanded: expandedComponents.has(component.id)
  }))

  return (
    <div className="relative rounded-[7px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
      <div className="rounded-t-[7px] text-base font-medium px-4 py-3.5 border-b border-slate-100 dark:border-slate-800">
        <div className="flex md:items-center justify-between md:flex-row flex-col md:gap-2 gap-4 items-start">
          <div className="flex items-center space-x-4">
            <h2 className="text-slate-900 dark:text-slate-50">System status</h2>
            <div className="hidden md:flex items-center text-sm font-normal space-x-1 mt-[1px] text-slate-500">
              <button
                onClick={() => setCurrentPeriodIndex(Math.min(periods.length - 1, currentPeriodIndex + 1))}
                disabled={currentPeriodIndex >= periods.length - 1}
                className={`transition ${currentPeriodIndex >= periods.length - 1 ? 'text-slate-200 dark:text-slate-700 cursor-not-allowed' : 'text-slate-300 dark:text-slate-500 hover:text-slate-500 dark:hover:text-slate-300 cursor-pointer'}`}
              >
                <ChevronLeft className="w-4 h-4 font-semibold" />
              </button>
              <div className="select-none flex justify-center whitespace-nowrap text-slate-400 dark:text-slate-500">
                {currentPeriod.label}
              </div>
              <button
                onClick={() => setCurrentPeriodIndex(Math.max(0, currentPeriodIndex - 1))}
                disabled={currentPeriodIndex <= 0}
                className={`transition ${currentPeriodIndex <= 0 ? 'text-slate-200 dark:text-slate-700 cursor-not-allowed' : 'text-slate-300 dark:text-slate-500 hover:text-slate-500 dark:hover:text-slate-300 cursor-pointer'}`}
              >
                <ChevronRight className="w-4 h-4 font-semibold" />
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="text-slate-900 dark:text-slate-100">
        <div className="divide-y divide-solid text-sm divide-slate-50 dark:divide-slate-800">
          {enhancedComponents.map((component) => (
            <ComponentRow
              key={component.id}
              component={component}
              isExpanded={component.isExpanded}
              onToggle={() => toggleComponent(component.id)}
              subComponents={component.subComponents}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
