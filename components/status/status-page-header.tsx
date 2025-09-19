"use client"

import { useStatusPageData } from "./status-page-provider"
import type { StatusSummary } from "./types"

interface StatusPageHeaderProps {
  slug: string
}

export function StatusPageHeader({ slug }: StatusPageHeaderProps) {
  const { statusData } = useStatusPageData()

  return (
    <header className="border-b bg-background">
      <div className="mx-auto max-w-5xl px-4 py-4 md:py-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {statusData.logo_url ? (
            <img 
              src={statusData.logo_url} 
              alt="Logo" 
              className="size-6 rounded-md object-contain"
            />
          ) : (
            <span className="inline-block size-6 rounded-md bg-foreground/90" aria-hidden />
          )}
          <span className="font-semibold">
            {statusData.name ? `${statusData.name} Status` : "Status Page"}
          </span>
        </div>
        <nav aria-label="Status navigation">
          <ul className="hidden md:flex items-center gap-4 text-sm text-muted-foreground">
            <li className="hover:text-foreground transition-colors">
              <a href="#active-incidents">Incidents</a>
            </li>
            <li className="hover:text-foreground transition-colors">
              <a href="#components">Components</a>
            </li>
            <li className="hover:text-foreground transition-colors">
              <a href="#resolved">Resolved</a>
            </li>
            {statusData.support_url && (
              <li className="hover:text-foreground transition-colors">
                <a href={statusData.support_url} target="_blank" rel="noopener noreferrer">
                  Support
                </a>
              </li>
            )}
          </ul>
        </nav>
      </div>
    </header>
  )
}
