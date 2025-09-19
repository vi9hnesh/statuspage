"use client"

import { createContext, useContext, ReactNode } from "react"
import type { StatusSummary, IncidentsPayload } from "./types"

interface StatusPageContextType {
  statusData: StatusSummary
  incidentsData: IncidentsPayload
}

const StatusPageContext = createContext<StatusPageContextType | null>(null)

interface StatusPageProviderProps {
  children: ReactNode
  statusData: StatusSummary
  incidentsData: IncidentsPayload
}

export function StatusPageProvider({ children, statusData, incidentsData }: StatusPageProviderProps) {
  return (
    <StatusPageContext.Provider value={{ statusData, incidentsData }}>
      {children}
    </StatusPageContext.Provider>
  )
}

export function useStatusPageData() {
  const context = useContext(StatusPageContext)
  if (!context) {
    throw new Error("useStatusPageData must be used within StatusPageProvider")
  }
  return context
}
